import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string

  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly password: string

  @IsNotEmpty()
  @IsString()
  readonly userTag: string
}

export class CreateProUserDto {
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
  readonly isCompanyAccount: boolean

  @IsNotEmpty()
  @IsString()
  readonly companyAddress: string

  @IsNotEmpty()
  @IsString()
  readonly companyWebsite: string

  @IsNotEmpty()
  @IsString()
  readonly activitySector: string

  @IsNotEmpty()
  @IsString()
  readonly companySiren: string
}
