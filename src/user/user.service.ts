import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import {
  CreateUserDto,
  CreateProUserDto,
  FindByEmailDto,
  DeleteUserDto,
} from './dto'
import { BanningUserDto } from 'src/admin/dto'
import { UserEntity } from './entities/user.entity'
import { BanningStatus } from '@prisma/client'

@Injectable()
export class UserService {
  private readonly _logger = new Logger(UserService.name)

  constructor(private readonly prismaService: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const nbUserTag = await this.prismaService.users.findMany({
        where: {
          userTag: {
            startsWith: createUserDto.userTag,
          },
        },
      })

      let realUserTag = createUserDto.userTag
      if (nbUserTag.length !== 0) realUserTag += nbUserTag.length.toString()

      const user = await this.prismaService.users.create({
        data: {
          nameLowercase: createUserDto.name.toLowerCase(),
          ...createUserDto,
          userTag: realUserTag,
        },
      })
      return new UserEntity(user)
    } catch (err) {
      return null
    }
  }

  async createProUser(createUserDto: CreateProUserDto) {
    try {
      const user = await this.prismaService.users.create({
        data: {
          nameLowercase: createUserDto.name.toLowerCase(),
          ...createUserDto,
        },
      })
      return new UserEntity(user)
    } catch (err) {
      return null
    }
  }

  async findByEmail(findByEmailDto: FindByEmailDto) {
    const user = await this.prismaService.users.findUnique({
      where: { email: findByEmailDto.email },
    })
    if (!user) return null
    return new UserEntity(user)
  }

  async findUsers() {
    const users = await this.prismaService.users.findMany()
    return users.map((user) => new UserEntity(user))
  }

  async getUsersBySearch(queryUsername: string) {
    const usernameList = await this.prismaService.users.findMany({
      take: 50,
      where: { nameLowercase: { contains: queryUsername.toLowerCase() } },
    })
    const userNoneFollow = usernameList.map((user) => {
      return {
        id: user.id,
        name: user.name,
      }
    })
    return userNoneFollow
  }

  async deleteUserByID(deleteDto: DeleteUserDto) {
    await this.prismaService.users.delete({ where: { id: deleteDto.id } })
    return { message: 'User successfully deleted.' }
  }

  async banUserByID(banningUserDto: BanningUserDto) {
    await this.prismaService.users.update({
      where: { id: banningUserDto.id },
      data: { banned: BanningStatus.banned },
    })
    return { message: 'User successfully banned.' }
  }

  async unbanUserByID(banningUserDto: BanningUserDto) {
    await this.prismaService.users.update({
      where: { id: banningUserDto.id },
      data: { banned: BanningStatus.notBanned },
    })
    return { message: 'User successfully unbanned.' }
  }

  async updateConnectedStatus(userId: string, connectedStatus: boolean) {
    try {
      const user = await this.prismaService.users.update({
        where: { id: userId },
        data: { isConnected: connectedStatus },
      })
      this._logger.debug(
        `Update status of user: ${userId} [${user.name}] to: ${connectedStatus}`
      )
    } catch (err) {
      console.error(err)
      throw new BadRequestException(
        `An error occured when changing connected user status:
         ${userId} to: ${connectedStatus}`
      )
    }
  }
}
