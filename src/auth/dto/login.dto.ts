import { PickType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { CreateUserDto } from 'src/user/dto/create-user.dto'

export class LoginDto extends PickType(CreateUserDto, [
  'email',
  'password',
] as const) {}

export class VerifyDto {
  @IsNotEmpty()
  readonly email: string

  @IsNotEmpty()
  readonly code: string
}
