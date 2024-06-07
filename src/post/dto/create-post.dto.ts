import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreatePostDto {
  @IsNotEmpty()
  readonly content: string

  @IsOptional()
  @IsString()
  readonly imageBase64?: string

  @IsOptional()
  @IsArray()
  readonly tagsList?: Array<string>
}
