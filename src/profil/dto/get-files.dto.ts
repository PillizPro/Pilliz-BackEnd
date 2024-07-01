import { IsNotEmpty } from 'class-validator'

export class GetFilesDto {
  @IsNotEmpty()
  readonly userId: string
}
