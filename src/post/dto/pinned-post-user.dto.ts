import { IsOptional } from 'class-validator'

export class PinnedPostUserDto {
  @IsOptional()
  readonly userId: string
}
