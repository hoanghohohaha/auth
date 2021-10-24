import {
  CACHE_MANAGER,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Cache } from "cache-manager";
import { Connection, Repository } from "typeorm";
import { v4 } from "uuid";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";

export interface IPayload {
  email: string;
  sub: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly connection: Connection,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }

    throw new UnauthorizedException();
  }

  async createUser(
    data: CreateUserDto
  ): Promise<Omit<User, "password" | "refresh_tokens" | "id">> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    /* eslint-disable */
    const { password, refresh_tokens, id, ...rest } =
      await this.userService.createUser({
        ...data,
        password: hashedPassword,
      });
    return rest;
  }

  async createPayload(user: User): Promise<IPayload> {
    return { email: user.email, sub: user.id };
  }

  async createAccessToken(payload: IPayload): Promise<string> {
    return this.jwtService.sign(payload, { expiresIn: "1h" });
  }

  async createRefreshToken(user: User): Promise<string> {
    const token = v4();

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      user.refresh_tokens.push(token);
      await this.cacheManager.set(token, user, { ttl: 0 });
      await this.userRepository.save(user);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return token;
  }

  async login(
    user: User
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = await this.createPayload(user);

    return {
      access_token: await this.createAccessToken(payload),
      refresh_token: await this.createRefreshToken(user),
    };
  }

  async refreshToken(refresh_token: string): Promise<string> {
    const data = await this.cacheManager.get<User>(refresh_token);
    if (!data) throw new UnauthorizedException();
    return this.createAccessToken(await this.createPayload(data));
  }

  async disableRefreshToken(token: string): Promise<boolean> {
    const data = await this.cacheManager.get<User>(token);
    if (!data || !data.email) throw new NotFoundException();

    const user = await this.userService.findByEmail(data.email);
    if (!user.refresh_tokens.includes(token)) throw new UnauthorizedException();

    const result = await this.cacheManager.del(token);
    return Boolean(result);
  }

  async disableAllRefreshTokens(user: User): Promise<number> {
    let count = 0;
    await Promise.all(
      user.refresh_tokens.map(async (token) => {
        count += await this.cacheManager.del(token);
      })
    );
    return count;
  }
}
