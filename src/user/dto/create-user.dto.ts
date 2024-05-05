import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string

  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @IsNotEmpty()
  @MinLength(8)
  readonly password: string

  @IsNotEmpty()
  @IsString()
  readonly userTag: string
}
