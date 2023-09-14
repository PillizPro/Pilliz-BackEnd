import { Injectable } from '@nestjs/common'
import { DeleteDto } from './dto/delete.dto'
import { UserService } from 'src/user/user.service'

@Injectable()
export class AdminService {
  constructor(private readonly userService: UserService) { }

  async deleteUser(deleteDto: DeleteDto) {
    return await this.userService.deleteUserByID(deleteDto);
  }

  async getAllUsers() {
    return await this.userService.findUsers();
  }
}
