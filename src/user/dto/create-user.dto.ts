import { Roles } from "../user.entity";

export class CreateUserDto {
  email: string;
  password: string;
  role: Roles;
}
