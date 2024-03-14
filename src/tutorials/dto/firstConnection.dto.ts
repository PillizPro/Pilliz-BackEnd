import { IsNotEmpty } from 'class-validator'

export class FirstConnectionDto {
  @IsNotEmpty()
  readonly userId: string
}
