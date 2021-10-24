import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneOrFail({ email });
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const user = new User();
    user.email = data.email;
    user.password = data.password;
    user.role = data.role;

    try {
      await this.userRepository.save(user);
    } catch (err) {
      throw new HttpException(err.driverError?.detail, HttpStatus.CONFLICT);
    }
    return user;
  }
}
