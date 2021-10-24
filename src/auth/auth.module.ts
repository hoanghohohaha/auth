import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as redisStore from "cache-manager-redis-store";
import { User } from "../user/user.entity";
import { UserModule } from "../user/user.module";
import { AuthService } from "./auth.service";
import { jwtConstants } from "./constants";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env" }),
    TypeOrmModule.forFeature([User]),
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
    CacheModule.register({
      store: redisStore,
      url: process.env.REDIS_TLS_URL,
      tls: process.env.REDIS_TLS === "true" && {
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
      },
      connect_timeout: 15000,
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
