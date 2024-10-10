import { IsNotEmpty } from 'class-validator'

export class DeletedFilesDto {
  @IsNotEmpty()
  readonly docName: string
}