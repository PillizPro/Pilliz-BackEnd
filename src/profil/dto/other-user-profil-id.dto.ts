import { IsOptional } from 'class-validator'

export class OtherUserProfilIdDto {
  @IsOptional()
  readonly userId: string
}
