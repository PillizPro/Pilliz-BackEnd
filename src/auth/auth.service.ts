import { Injectable, UnauthorizedException } from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { UserService } from 'src/user/user.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(registerDto: CreateUserDto) {
    const hashedPassword = await this._hashPassword(registerDto.password)
    const userDtoWithHashedPassword = {
      ...registerDto,
      password: hashedPassword,
    }
    return await this.userService.createUser(userDtoWithHashedPassword)
  }

  private async _hashPassword(password: string): Promise<string> {
    const saltRounds = 10
    console.log(password, saltRounds)
    const hash = await bcrypt.hash(password, saltRounds)
    return hash
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto)

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.')
    }

    const isPasswordMatch = await this._verifyPassword(
      loginDto.password,
      user.password
    )

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid email or password.')
    }

    if (user.banned === 'banned') {
      return { status: 'banned' }
    }

    if (user.role === 'admin') {
      return { status: 'success', isAdmin: true }
    }
    return {
      status: 'success',
      isAdmin: false,
      username: user.name,
      email: user.email,
    }
  }

  private async _verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }
}
