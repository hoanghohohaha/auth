import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../../user/user.entity";
import { UserService } from "../../user/user.service";
import { IPayload } from "../auth.service";
import { jwtConstants } from "../constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: IPayload): Promise<User> {
    try {
      const user = await this.userService.findByEmail(payload.email);
      return user;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
