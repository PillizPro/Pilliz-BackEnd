import { Injectable, UnauthorizedException } from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { UserService } from 'src/user/user.service'
import { PrismaService } from 'src/prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { UserEntity } from 'src/user/entities/user.entity'
import { JwtService } from '@nestjs/jwt'
import { ITokenPayload } from './strategy/jwt.strategy'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(registerDto: CreateUserDto) {
    const hashedPassword = await this._hashPassword(registerDto.password)
    const userDtoWithHashedPassword = {
      ...registerDto,
      password: hashedPassword,
    }
    return await this.userService.createUser(userDtoWithHashedPassword)
  }

  async validateUser(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto)

    if (!user) return null

    const isPasswordMatching = await this._verifyPassword(
      loginDto.password,
      user.password
    )

    if (!isPasswordMatching) return null

    if (user.banned === 'banned') return { status: 'banned' }

    if (user.role === 'admin')
      return {
        status: 'success',
        isAdmin: true,
        email: user.email,
        id: user.id,
      }

    return {
      status: 'success',
      isAdmin: false,
      username: user.name,
      email: user.email,
      id: user.id,
      bio: user.bio,
      firstConnection: user.firstConnection,
      tutorialMarketplace: user.tutorialMarketplace,
      tutorialPro: user.tutorialPro,
    }
  }

  async login(user: any) {
    if (user.status === 'banned') return user
    const payload: ITokenPayload = { sub: user.id, email: user.email }
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: `${this.configService.get(
          'JWT_ACCESS_TOKEN_EXPIRATION_TIME'
        )}s`,
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: `${this.configService.get(
          'JWT_REFRESH_TOKEN_EXPIRATION_TIME'
        )}s`,
      }),
    }
  }

  async resetPassword(resetPassDto: ResetPasswordDto) {
    const { email, oldPassword, newPassword } = resetPassDto

    // console.log(email, oldPassword, newPassword)

    const user = await this.userService.findByEmail({ email })

    if (!user) throw new UnauthorizedException('Invalid email.')

    const isPasswordMatching = await this._verifyPassword(
      oldPassword,
      user.password
    )

    if (!isPasswordMatching)
      throw new UnauthorizedException('Invalid old password.')

    const hashedPassword = await this._hashPassword(newPassword)

    const reseting = await this.prisma.users.update({
      where: { email: email },
      data: { password: hashedPassword },
    })

    return new UserEntity(reseting)
  }

  private async _hashPassword(password: string): Promise<string> {
    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds)
    return hash
  }

  private async _verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }
}
