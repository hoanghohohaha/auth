import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { ApiController } from "./api/api.controller";
import { User } from "./user/user.entity";

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
      entities: [User],
      ssl: process.env.DB_SSL === "true" && { rejectUnauthorized: false },
      logging: true,
      synchronize: true,
    }),
  ],
  controllers: [ApiController],
  providers: [AppService],
})
export class AppModule { }
