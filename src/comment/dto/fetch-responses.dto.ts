import { IsNotEmpty } from 'class-validator'

export class FetchResponsesDto {
  @IsNotEmpty()
  readonly commentId: string

  @IsNotEmpty()
  readonly userId: string
}
