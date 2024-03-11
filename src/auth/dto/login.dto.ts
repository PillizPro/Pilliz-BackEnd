import { PickType } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { CreateUserDto } from 'src/user/dto/create-user.dto'

export class LoginDto extends PickType(CreateUserDto, [
  'email',
  'password',
] as const) {}

export class VerifyDto {
  @IsNotEmpty()
  @IsString()
  readonly email: string

  @IsNotEmpty()
  readonly code: string
}
