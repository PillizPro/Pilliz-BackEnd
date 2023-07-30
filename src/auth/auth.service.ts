import { Injectable } from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { UserService } from 'src/user/user.service'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(registerDto: CreateUserDto) {
    return await this.userService.createUser(registerDto)
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto)
    //check le password ici
    return user
  }
}
