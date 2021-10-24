import { Test } from "@nestjs/testing";
import { PassportModule } from "@nestjs/passport";
import { getRepositoryToken } from "@nestjs/typeorm";

import { AuthService } from "../auth.service";
import { LocalStrategy } from "./local.strategy";
import { mockedUserRepository, mockedUsers } from "../../user/user.mock";
import { User } from "../../user/user.entity";
import { Connection } from "typeorm";
import { UserService } from "../../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { mockedAuthService } from "../auth.mock";

describe("Testing validate functionality of LocalStrategy", () => {
  let localStrategy: LocalStrategy;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        // ConfigModule.forRoot({
        //   envFilePath: ".env.test",
        // }),
        // AuthModule,
        PassportModule,
        // TypeOrmModule.forRoot({
        //   type: "postgres",
        //   host: process.env.DB_HOST,
        //   port: parseInt(process.env.DB_PORT),
        //   username: process.env.DB_USER,
        //   password: process.env.DB_PASS,
        //   database: process.env.DB_DATABASE,
        //   entities: [User],
        //   logging: false,
        //   synchronize: true,
        // }),
        // TypeOrmModule.forFeature([User]),
      ],
      providers: [
        // AuthService,
        {
          provide: AuthService,
          useValue: mockedAuthService,
        },
        LocalStrategy,
        {
          provide: getRepositoryToken(User),
          useValue: mockedUserRepository,
        },
        UserService,
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: Connection,
          useValue: {},
        },
      ],
    }).compile();

    localStrategy = moduleRef.get<LocalStrategy>(LocalStrategy);
  });

  it("Should be defined", () => {
    expect(localStrategy).toBeDefined();
  });

  it("Should be a valid user", async () => {
    const { email, password } = mockedUsers[0];

    const result = await localStrategy.validate(email, password);
    expect(result).toEqual(mockedUsers[0]);
  });

  it("Using right email but wrong password", async () => {
    const { email, password } = mockedUsers[1];

    try {
      await localStrategy.validate(email, password + "wrong password");
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  it("Using wrong email but right password", async () => {
    const { email, password } = mockedUsers[2];

    try {
      await localStrategy.validate(email + "invalid email", password);
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  it("Using wrong email and password", async () => {
    const { email, password } = mockedUsers[0];

    try {
      await localStrategy.validate(
        email + "invalid email",
        password + "wrong password"
      );
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });
});
