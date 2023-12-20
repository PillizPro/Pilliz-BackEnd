import { Follows } from '@prisma/client'

export class FollowEntity implements Follows {
  constructor(partial: Partial<FollowEntity>) {
    Object.assign(this, partial)
  }
  followerId: string
  followingId: string
}
