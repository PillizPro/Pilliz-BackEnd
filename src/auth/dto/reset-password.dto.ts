import { IsNotEmpty } from 'class-validator'

export class ResetPasswordDto {
  @IsNotEmpty()
  readonly email: string

  @IsNotEmpty()
  readonly oldPassword: string

  @IsNotEmpty()
  readonly newPassword: string
}
