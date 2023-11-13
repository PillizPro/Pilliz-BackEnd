import { IsNotEmpty } from 'class-validator'

export class FindPostDto {
  @IsNotEmpty()
  readonly id: string
}
