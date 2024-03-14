import { IsNotEmpty } from 'class-validator'

export class AddDeviceDetailsDto {
  @IsNotEmpty()
  readonly userId: string

  @IsNotEmpty()
  readonly deviceRelease: string

  @IsNotEmpty()
  readonly deviceVersion: string

  @IsNotEmpty()
  readonly deviceName: string

  @IsNotEmpty()
  readonly deviceWidth: number

  @IsNotEmpty()
  readonly deviceHeight: number
}
