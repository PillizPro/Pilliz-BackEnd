import { Injectable } from '@nestjs/common'
import { DeleteUserDto } from 'src/user/dto/delete-user.dto'
import { BanningUserDto } from './dto/banning-user.dto'
import { UserService } from 'src/user/user.service'

@Injectable()
export class AdminService {
  constructor(private readonly userService: UserService) {}

  async deleteUser(deleteUserDto: DeleteUserDto) {
    return await this.userService.deleteUserByID(deleteUserDto)
  }

  async banUser(banningUserDto: BanningUserDto) {
    return await this.userService.banUserByID(banningUserDto)
  }

  async unbanUser(banningUserDto: BanningUserDto) {
    return await this.userService.unbanUserByID(banningUserDto)
  }

  async getAllUsers() {
    return await this.userService.findUsers()
  }
}
