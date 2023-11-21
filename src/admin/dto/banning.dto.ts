import { PickType } from '@nestjs/swagger'
import { BanningUserDto } from './banning-user.dto'

export class BanningDto extends PickType(BanningUserDto, ['id'] as const) {}
