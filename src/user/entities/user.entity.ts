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
  userTag: string | null
  @ApiHideProperty()
  @Exclude()
  nameLowercase: string
  @ApiHideProperty()
  @Exclude()
  password: string
  @ApiHideProperty()
  @Exclude()
  hashedRefreshToken: string | null
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
  totalIdentifyTime: number
  totalAppTime: number
  totalFeedTime: number
  totalMarketTime: number
  totalProTime: number
  deviceRelease: string
  deviceVersion: string
  deviceName: string
  deviceWidth: number
  deviceHeight: number
  // Pro
  isCompanyAccount: boolean
  companyAddress: string
  companyWebsite: string
  activitySector: string
  companySiren: string
  // Blocking / Hiding
  blockedUsers: string[]
  hiddenUsers: string[]
  hiddenWords: string[]
}
