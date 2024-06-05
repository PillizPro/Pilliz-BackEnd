import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class ChangeBioDto {
  @IsNotEmpty()
  readonly id: string

  @IsOptional()
  @IsString()
  readonly bio: string
}
