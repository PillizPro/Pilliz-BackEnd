import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { FindByEmailDto } from './dto/find-by-email.dto'
import { DeleteUserDto } from './dto/delete-user.dto'
import { UserEntity } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) { }

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
    if (!user) throw new NotFoundException('User Not Found')
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
      throw new Error('An error occurred while deleting the user.')
    }
  }
}
