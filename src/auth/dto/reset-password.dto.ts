import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @IsNotEmpty()
  @IsString()
  readonly oldPassword: string

  @IsNotEmpty()
  @IsString()
  readonly newPassword: string
}
