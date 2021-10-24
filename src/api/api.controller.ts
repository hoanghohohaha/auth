import {
  Controller,
  Post,
  UseGuards,
  Request,
  UnauthorizedException,
  Get,
  Delete,
  Body,
  HttpStatus,
  Param,
} from "@nestjs/common";
import { Request as ExpressRequest } from "express";
import { AuthService } from "../auth/auth.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { LocalAuthGuard } from "../auth/guards/local-auth.guard";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { User } from "../user/user.entity";

@Controller("api")
export class ApiController {
  constructor(private authService: AuthService) { }

  @Post("user")
  async register(
    @Body() body: CreateUserDto
  ): Promise<Omit<User, "id" | "password" | "refresh_tokens">> {
    return this.authService.createUser(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post("token")
  async login(
    @Request() req: ExpressRequest & { user: User }
  ): Promise<{ access_token: string; refresh_token: string }> {
    return this.authService.login(req.user);
  }

  @Post("refresh")
  async newAccessToken(
    @Request() req: ExpressRequest
  ): Promise<{ access_token: string }> {
    const refresh_token = req.headers.authorization?.split(" ")[1];
    if (!refresh_token) throw new UnauthorizedException();
    return { access_token: await this.authService.refreshToken(refresh_token) };
  }

  @UseGuards(JwtAuthGuard)
  @Get("verify")
  async verifyAccessToken(
    @Request() req: ExpressRequest & { user: User }
  ): Promise<Omit<User, "id" | "password" | "refresh_tokens">> {
    /* eslint-disable */
    const { password, refresh_tokens, ...rest } = req.user;
    return rest;
  }

  @UseGuards(JwtAuthGuard)
  @Delete("refresh/:token")
  async disableRefreshToken(
    @Param("token") refresh_token: string
  ): Promise<{ status: HttpStatus; message: string }> {
    const disabled = await this.authService.disableRefreshToken(refresh_token);
    if (disabled) {
      return {
        status: HttpStatus.OK,
        message: "Deleted",
      };
    } else {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: "I dun't know",
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete("refresh")
  async disableAllTokens(
    @Request() req: ExpressRequest & { user: User }
  ): Promise<{ status: HttpStatus; count: number }> {
    const result = await this.authService.disableAllRefreshTokens(req.user);
    return {
      status: HttpStatus.OK,
      count: result,
    };
  }
}
