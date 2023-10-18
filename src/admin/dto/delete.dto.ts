import { PickType } from '@nestjs/swagger'
import { DeleteUserDto } from 'src/user/dto/delete-user.dto'

export class DeleteDto extends PickType(DeleteUserDto, [
  'id',
] as const) { }