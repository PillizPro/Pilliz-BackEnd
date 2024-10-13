import { IsEnum, IsNotEmpty } from 'class-validator'
import { SignalementCategory } from '@prisma/client'

export class SignalementDto {
  @IsNotEmpty()
  @IsEnum(SignalementCategory)
  readonly category: SignalementCategory

  @IsNotEmpty()
  readonly description: string

  @IsNotEmpty()
  readonly userId: string
}
