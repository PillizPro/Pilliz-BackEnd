import { Body, Controller, Post, Get } from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { AuthService } from './auth.service'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { ApiTags } from '@nestjs/swagger'
import { Query } from '@nestjs/common'
import { isAcademic } from 'swot-node'

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: CreateUserDto) {
    const isBoolAcademic = await isAcademic(registerDto.email)
    if (!isBoolAcademic) {
      return { status: 'error', message: 'Not an academic email' }
    }
    return await this.authService.register(registerDto)
  }

  @Get('verify')
  async verify(@Query('email') email: string, @Query('token') token: string) {
    return await this.authService.verify(email, token)
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto)
  }
}
