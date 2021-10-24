import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: { origin: "http://localhost:3000" } });

  await app.listen(process.env.PORT || 8000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
