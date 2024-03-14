import { IsNotEmpty } from 'class-validator'

export class ResetPassword {
  @IsNotEmpty()
  readonly email: string

  @IsNotEmpty()
  readonly oldPassword: string

  @IsNotEmpty()
  readonly newPassword: string
}
