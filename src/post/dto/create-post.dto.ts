import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreatePostDto {
  @IsNotEmpty()
  readonly userId: string

  @IsNotEmpty()
  readonly content: string

  @IsOptional()
  @IsString()
  readonly imageBase64?: string;
}
