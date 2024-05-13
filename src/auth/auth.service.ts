import { Injectable, UnauthorizedException } from '@nestjs/common'
import { LoginDto, VerifyDto } from './dto/login.dto'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { ResetPassword } from './dto/reset-password.dto'
import { UserService } from 'src/user/user.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { isAcademic } from 'swot-node'
import { MailerService } from 'src/mailer/mailer.service'
import * as bcrypt from 'bcrypt'
import { ValidationEmail } from 'src/mailer/dto/mailer.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService
  ) {}

  async register(registerDto: CreateUserDto) {
    const boolAcademic = await isAcademic(registerDto.email)
    if (!boolAcademic) {
      throw new UnauthorizedException('You must use an academic email.')
    }
    const hashedPassword = await this._hashPassword(registerDto.password)
    const numberVerification = await this._generateCode()
    const userDtoWithHashedPassword = {
      ...registerDto,
      password: hashedPassword,
      codeVerification: numberVerification,
    }
    const email = new ValidationEmail()
    email.name = registerDto.name
    email.code = numberVerification
    this.mailerService.sendMail(registerDto.email, email)
    return await this.userService.createUser(userDtoWithHashedPassword)
  }

  private async _generateCode() {
    const min = 100000
    const max = 999999
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  private async _hashPassword(password: string): Promise<string> {
    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds)
    return hash
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto)

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.')
    }

    if (user.isVerified === false) {
      throw new UnauthorizedException('You must verify your email.')
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
      id: user.id,
      bio: user.bio,
      firstConnection: user.firstConnection,
      tutorialMarketplace: user.tutorialMarketplace,
      tutorialPro: user.tutorialPro,
    }
  }

  async verify(verifyDto: VerifyDto) {
    const user = await this.userService.findByEmail({ email: verifyDto.email })
    if (user) {
      if (user.codeVerification === parseInt(verifyDto.code)) {
        this.userService.updateVerifiedStatus(user.id)
      } else {
        throw new UnauthorizedException('Invalid code.')
      }
    } else {
      throw new UnauthorizedException('Invalid email.')
    }
    return { status: 'success' }
  }

  private async _verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }

  async resetPassword(resetPassDto: ResetPassword) {
    const { email, oldPassword, newPassword } = resetPassDto

    // console.log(email, oldPassword, newPassword)

    const user = await this.userService.findByEmail({ email })

    if (!user) {
      throw new UnauthorizedException('Invalid email.')
    }

    const isPasswordMatch = await this._verifyPassword(
      oldPassword,
      user.password
    )

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid old password.')
    }

    const hashedPassword = await this._hashPassword(newPassword)

    const reseting = await this.prisma.users.update({
      where: { email: email },
      data: { password: hashedPassword },
    })

    return reseting
  }
}
