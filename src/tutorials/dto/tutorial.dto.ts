import { IsNotEmpty } from 'class-validator'

export class TutorialsDto {
  @IsNotEmpty()
  readonly userId: string

  @IsNotEmpty()
  readonly tutorialName: string
}
