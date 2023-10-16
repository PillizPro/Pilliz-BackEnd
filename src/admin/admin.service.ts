import { Injectable } from '@nestjs/common'
import { DeleteDto } from './dto/delete.dto'
import { BanningDto } from './dto/banning.dto';
import { UserService } from 'src/user/user.service'

@Injectable()
export class AdminService {
  constructor(private readonly userService: UserService) { }

  async deleteUser(deleteDto: DeleteDto) {
    return await this.userService.deleteUserByID(deleteDto);
  }

  async banUser(banningDto: BanningDto) {
    return await this.userService.banUserByID(banningDto);
  }

  async unbanUser(banningDto: BanningDto) {
    return await this.userService.unbanUserByID(banningDto);
  }

  async getAllUsers() {
    return await this.userService.findUsers();
  }
}
