import { Body, Controller, Post } from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { AuthService } from './auth.service'
import { CreateUserDto, CreateProUserDto } from 'src/user/dto/create-user.dto'
import { ApiTags } from '@nestjs/swagger'
import { ResetPassword } from './dto/reset-password.dto'

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: CreateUserDto) {
    return await this.authService.register(registerDto)
  }

  @Post('registerPro')
  async registerPro(@Body() registerDto: CreateProUserDto) {
    return await this.authService.registerPro(registerDto)
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto)
  }

  @Post('resetPassword')
  async resetPassword(@Body() resetPasswordDto: ResetPassword) {
    return await this.authService.resetPassword(resetPasswordDto)
  }
}
