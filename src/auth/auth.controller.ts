import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { AuthService } from './auth.service'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { ApiTags } from '@nestjs/swagger'
import { LogInWithCredentialsGuard } from './guards/login-with-credentials.guard'

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() registerDto: CreateUserDto) {
    return await this.authService.register(registerDto)
  }

  @UseGuards(LogInWithCredentialsGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser) {
    return request.user
    return await this.authService.login(loginDto)
  }
}
