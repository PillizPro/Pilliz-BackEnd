import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { FindByEmailDto } from './dto/find-by-email.dto'
import { DeleteUserDto } from './dto/delete-user.dto'
import { BanningUserDto } from 'src/admin/dto/banning-user.dto'
import { UserEntity } from './entities/user.entity'
import { BanningStatus } from '@prisma/client'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.prismaService.users.create({
      data: createUserDto,
    })
    return new UserEntity(user)
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

  async deleteUserByID(deleteDto: DeleteUserDto) {
    try {
      await this.prismaService.users.delete({ where: { id: deleteDto.id } })
      return { message: 'User successfully deleted.' }
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when deleting the user.')
    }
  }

  async banUserByID(banningUserDto: BanningUserDto) {
    try {
      await this.prismaService.users.update({
        where: { id: banningUserDto.id },
        data: { banned: BanningStatus.banned },
      })
      return { message: 'User successfully banned.' }
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when banning the user.')
    }
  }

  async unbanUserByID(banningUserDto: BanningUserDto) {
    try {
      await this.prismaService.users.update({
        where: { id: banningUserDto.id },
        data: { banned: BanningStatus.notBanned },
      })
      return { message: 'User successfully unbanned.' }
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when unbanning the user.')
    }
  }
}
