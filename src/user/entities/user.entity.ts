import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { Users, UserRoles, BanningStatus } from '@prisma/client'
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
  @ApiProperty({ enum: BanningStatus, enumName: 'BanningStatus' })
  banned: BanningStatus
  createdAt: Date
  updatedAt: Date
  firstConnection: boolean
  tutorialFeed: boolean
  tutorialMarketplace: boolean
  tutorialPro: boolean
  bio: string
  isConnected: boolean
  profilPicture: string
  // Métriques
  country: string
}
