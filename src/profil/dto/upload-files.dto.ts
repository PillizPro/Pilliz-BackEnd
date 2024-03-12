import { IsNotEmpty } from 'class-validator'

export class UploadFilesDto {
  @IsNotEmpty()
  readonly userId: string

  @IsNotEmpty()
  readonly docName: string

  @IsNotEmpty()
  readonly docBytes: string

  @IsNotEmpty()
  readonly docType: string
}
