import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto, CreateProUserDto } from 'src/user/dto/create-user.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { Request } from 'express'
import { JwtRefreshAuthGuard, LocalAuthGuard } from 'src/common/guards'
import { CurrentUser, CurrentUserId, Public } from 'src/common/decorators'

export type Tokens = {
  accessToken: string
  refreshToken: string
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Post('register')
  async register(@Body() registerDto: CreateUserDto) {
    return await this.authService.register(registerDto)
  }

  @Public()
  @Post('registerPro')
  async registerPro(@Body() registerDto: CreateProUserDto) {
    return await this.authService.registerPro(registerDto)
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request): Promise<Tokens | undefined> {
    return await this.authService.login(req.user)
  }

  @ApiBearerAuth()
  @Get('userAuthInfo')
  async getUserAuthInfo(@CurrentUserId() userId: string) {
    return await this.authService.getUserAuthInfo(userId)
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@CurrentUserId() userId: string) {
    return await this.authService.logout(userId)
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @Post('resetPassword')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto)
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refreshTokens')
  async refresh(
    @CurrentUserId() userId: string,
    @CurrentUser('refreshToken') refreshToken: string
  ): Promise<Tokens> {
    return await this.authService.refreshTokens(userId, refreshToken)
  }
}
