import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class VerifyDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @IsNotEmpty()
  @IsString()
  readonly code: string
}
