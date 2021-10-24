import { UnauthorizedException } from "@nestjs/common";
import { User } from "../user/user.entity";
import { mockedUserRepository } from "../user/user.mock";

export const mockedBcrypt = {
  /* eslint-disable */
  hash: (pass: string, _: number | string): Promise<string> =>
    Promise.resolve(pass),
  compare: (a: string, b: string): Promise<boolean> => Promise.resolve(a === b),
};

export const mockedAuthService = {
  validateUser: async (email: string, password: string): Promise<User> => {
    const user = await mockedUserRepository.findOneOrFail({ email });
    if (!user || user.password !== password) throw new UnauthorizedException();
    return user;
  },
};
