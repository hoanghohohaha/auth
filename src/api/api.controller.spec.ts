import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { ApiController } from "./api.controller";
import { AuthService } from "../auth/auth.service";

jest.mock("bcrypt");
(bcrypt.compare as jest.Mock) = jest
  .fn()
  .mockImplementation((a: string, b: string) => a === b);

describe("ApiController", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [
        {
          provide: AuthService,
          useValue: {},
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (!app) return;
    await app.close();
  });

  it("1 + 1 should be 2", () => {
    expect(1 + 1).toBe(2);
  });

  // describe("Using valid input", () => {});

  // describe("Using invalid input", () => {});
});
