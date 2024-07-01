import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class ChangeBioDto {
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  readonly bio: string
}
