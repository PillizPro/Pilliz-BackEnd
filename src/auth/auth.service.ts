import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { CreateUserDto, CreateProUserDto } from 'src/user/dto/create-user.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { UserService } from 'src/user/user.service'
import { PrismaService } from 'src/prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { UserEntity } from 'src/user/entities/user.entity'
import { JwtService } from '@nestjs/jwt'
import { ITokenPayload } from './strategies/jwt.strategy'
import { ConfigService } from '@nestjs/config'
import { Tokens } from './auth.controller'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(registerDto: CreateUserDto) {
    const hashedPassword = await this._hashData(registerDto.password)
    const userDtoWithHashedPassword = {
      ...registerDto,
      password: hashedPassword,
    }
    const newUser = await this.userService.createUser(userDtoWithHashedPassword)
    if (!newUser) throw new ConflictException('User already exists')
    return newUser
  }

  async registerPro(registerDto: CreateProUserDto) {
    const hashedPassword = await this._hashData(registerDto.password)
    const userDtoWithHashedPassword = {
      ...registerDto,
      password: hashedPassword,
    }
    const newProUser = await this.userService.createProUser(
      userDtoWithHashedPassword
    )
    if (!newProUser)
      throw new ConflictException('Professional User already exists')
    return newProUser
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

    return {
      email: user.email,
      id: user.id,
    }
  }

  async login(user: any): Promise<Tokens | undefined> {
    if (!user) return
    const tokens = await this._generateTokens(user.id, user.email)
    await this._updateRefreshTokenHash(user.id, tokens.refreshToken)
    return tokens
  }

  async getUserAuthInfo(userId: string) {
    const user = await this.prismaService.users.findUnique({
      where: { id: userId },
    })
    if (!user) throw new UnauthorizedException("This user doesn't exists.")
    if (user.role === 'admin')
      return {
        isAdmin: true,
        email: user.email,
      }
    return {
      id: userId,
      isAdmin: false,
      username: user.name,
      email: user.email,
      userImgUrl: user.profilPicture,
      bio: user.bio,
      firstConnection: user.firstConnection,
      tutorialMarketplace: user.tutorialMarketplace,
      tutorialPro: user.tutorialPro,
      isCompanyAccount: user.isCompanyAccount,
    }
  }

  async logout(userId: string) {
    await this.prismaService.users.updateMany({
      where: {
        id: userId,
        hashedRefreshToken: {
          not: null,
        },
      },
      data: {
        hashedRefreshToken: null,
      },
    })
  }

  async resetPassword(resetPassDto: ResetPasswordDto) {
    const { email, oldPassword, newPassword } = resetPassDto

    const user = await this.userService.findByEmail({ email })

    if (!user) throw new UnauthorizedException('Invalid email.')

    const isPasswordMatching = await this._verifyPassword(
      oldPassword,
      user.password
    )

    if (!isPasswordMatching)
      throw new UnauthorizedException('Invalid old password.')

    const hashedPassword = await this._hashData(newPassword)

    const reseting = await this.prismaService.users.update({
      where: { email: email },
      data: { password: hashedPassword },
    })

    return new UserEntity(reseting)
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    const user = await this.prismaService.users.findUnique({
      where: { id: userId },
    })
    if (!user || !user.hashedRefreshToken || !refreshToken)
      throw new ForbiddenException('Access Denied')
    const isRefreshTokensMatching = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken
    )
    if (!isRefreshTokensMatching) throw new ForbiddenException('Access Denied')
    const tokens = await this._generateTokens(user.id, user.email)
    await this._updateRefreshTokenHash(user.id, tokens.refreshToken)
    return tokens
  }

  private async _hashData(data: string): Promise<string> {
    const saltRounds = 10
    const hash = await bcrypt.hash(data, saltRounds)
    return hash
  }

  private async _verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }

  private async _generateTokens(
    userId: string,
    email: string
  ): Promise<Tokens> {
    const payload: ITokenPayload = { sub: userId, email: email }
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: `${this.configService.get(
          'JWT_ACCESS_TOKEN_EXPIRATION_TIME'
        )}s`,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: `${this.configService.get(
          'JWT_REFRESH_TOKEN_EXPIRATION_TIME'
        )}s`,
      }),
    ])
    return {
      accessToken,
      refreshToken,
    }
  }

  private async _updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this._hashData(refreshToken)
    await this.prismaService.users.update({
      where: { id: userId },
      data: { hashedRefreshToken: hashedRefreshToken },
    })
  }
}
