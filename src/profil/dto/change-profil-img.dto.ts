import { IsNotEmpty } from 'class-validator'

export class ChangeProfilImgDto {
  @IsNotEmpty()
  readonly imgBytes: string
}
