import { IsNotEmpty } from 'class-validator'

export class ChangeProfilImgDto {
  @IsNotEmpty()
  readonly id: string

  @IsNotEmpty()
  readonly imgBytes: string
}
