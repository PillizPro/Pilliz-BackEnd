import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { Users, UserRoles } from '@prisma/client'
import { Exclude } from 'class-transformer'

export class UserEntity implements Users {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial)
  }
  id: string
  email: string
  name: string
  @ApiHideProperty()
  @Exclude()
  password: string
  @ApiProperty({ enum: UserRoles, enumName: 'UserRoles' })
  role: UserRoles
  createdAt: Date
  updatedAt: Date
}
