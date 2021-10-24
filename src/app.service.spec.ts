import { Test, TestingModule } from "@nestjs/testing";
import { AppService } from "./app.service";

describe("AppService", () => {
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  it("Should be defined", () => {
    expect(appService).toBeDefined();
  });

  it("Call getHello method", () => {
    expect(appService.getHello()).toBe("Hello world");
  });
});
