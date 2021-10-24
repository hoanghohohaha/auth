import { CacheModule } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Connection } from "typeorm";

import { User } from "../user/user.entity";
import { mockedUserRepository } from "../user/user.mock";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import { jwtConstants } from "./constants";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

describe("AuthService", () => {
  let service: AuthService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        // ConfigModule.forRoot({
        //   envFilePath: ".env.test",
        // }),
        PassportModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: "60s" },
        }),
        CacheModule.register(),
      ],
      providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        {
          provide: getRepositoryToken(User),
          useValue: mockedUserRepository,
        },
        {
          provide: Connection,
          useValue: {},
        },
        UserService,
      ],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  // it("should return null when credentials are invalid", async () => {
  //   jest.setTimeout(10000);
  //   try {
  //     await service.validateUser("xxx", "xxx");
  //     expect(true).toBe(false);
  //   } catch (err) {
  //     expect(err).toEqual(new UnauthorizedException());
  //   }
  // });
});

// describe('validateLogin', () => {
//   let service: AuthService;

//   beforeEach(async () => {
//     const moduleRef: TestingModule = await Test.createTestingModule({
//       imports: [
//         UsersModule,
//         PassportModule,
//         JwtModule.register({
//           secret: jwtConstants.secret,
//           signOptions: { expiresIn: '60s' },
//         }),
//       ],
//       providers: [AuthService, LocalStrategy, JwtStrategy],
//     }).compile();

//     service = moduleRef.get<AuthService>(AuthService);
//   });

//   it('should return JWT object when credentials are valid', async () => {
//     const res = await service.login({ username: 'maria', userId: 3 });
//     expect(res.access_token).toBeDefined();
//   });
// });
