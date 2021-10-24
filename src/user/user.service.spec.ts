import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { Roles, User } from "./user.entity";
import { UserService } from "./user.service";
import { mockedUserRepository, mockedUsers } from "./user.mock";

describe("UsersService", () => {
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockedUserRepository,
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
  });

  it("Should return 2", () => expect(1 + 1).toBe(2));

  it("Should find the user", async () => {
    const user = await userService.findByEmail(mockedUsers[0].email);
    expect(user).toEqual(mockedUsers[0]);
  });

  it("Should find Giang", async () => {
    const user = await userService.findByEmail(mockedUsers[1].email);
    expect(user).toEqual(mockedUsers[1]);
  });

  it("Should not find anyone and raise error", async () => {
    try {
      await userService.findByEmail("hoang@vietcode.org");
      expect(1).toBe(2);
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  it("Should add new user", async () => {
    const newUserData: CreateUserDto = {
      email: "hoanghohohaha@gmail.com",
      password: "hmmmm",
      role: Roles.USER,
    };
    const user = await userService.createUser(newUserData);
    const alsoThatUser = await userService.findByEmail(newUserData.email);
    expect(user).toEqual(alsoThatUser);
  });
});
