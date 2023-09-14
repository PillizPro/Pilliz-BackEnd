import { Injectable } from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { UserService } from 'src/user/user.service'
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) { }

  async register(registerDto: CreateUserDto) {
    return await this.userService.createUser(registerDto)
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto)

    if (!user || user.password !== loginDto.password) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (user.role === 'admin') {
      return { status: 'success', isAdmin: true };
    }
    return { status: 'success', isAdmin: false };
  }
}
