import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { FindByEmailDto } from './dto/find-by-email.dto'
import { UserEntity } from './entities/user.entity'
import { MailService } from 'src/mail/mail.service'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService
  ) {}

  async signIn(username: any, pass: any) {
    const payload = { sub: username, username: pass }
    return {
      accessToken: await this.jwtService.signAsync(payload),
    }
  }

  async test(createUserDto: CreateUserDto) {
    const token = Math.floor(1000 + Math.random() * 9000).toString()
    await this.mailService.sendUserConfirmation(
      createUserDto.email,
      createUserDto.name,
      token
    )
  }

  async createUser(createUserDto: CreateUserDto) {
    await this.test(createUserDto)
    const user = await this.prismaService.users.create({
      data: createUserDto,
    })
    return new UserEntity(user)
  }

  async findByEmail(findByEmailDto: FindByEmailDto) {
    const user = await this.prismaService.users.findUnique({
      where: { email: findByEmailDto.email },
    })
    if (!user) throw new NotFoundException('User Not Found')
    return new UserEntity(user)
  }
}
