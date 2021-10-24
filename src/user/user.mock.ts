import { UnauthorizedException } from "@nestjs/common";
import { Roles, User } from "./user.entity";

export const mockedUsers: User[] = [
  {
    id: 1,
    email: "projectube@vietcode.org",
    password: "khong lam ma doi co an",
    role: Roles.SALER,
    refresh_tokens: [],
  },
  {
    id: 2,
    email: "bhuonggiang03@gmail.com",
    password: "hokbiet",
    role: Roles.ADMIN,
    refresh_tokens: [],
  },
  {
    id: 3,
    email: "duc@gmail.com",
    password: "hokbiet",
    role: Roles.USER,
    refresh_tokens: [],
  },
];

export const mockedUserRepository = {
  findOneOrFail: async ({ email }: { email: string }): Promise<User> => {
    const user = mockedUsers.find((u) => u.email === email);
    if (!user) throw new UnauthorizedException();
    return user;
  },

  save: (user: User): Promise<User> => {
    user.id = mockedUsers.length + 1;
    user.refresh_tokens = [];
    mockedUsers.push(user);
    return Promise.resolve(user);
  },
};
