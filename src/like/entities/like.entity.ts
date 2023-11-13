import { Like } from '@prisma/client'

export class LikeEntity implements Like {
  constructor(partial: Partial<LikeEntity>) {
    Object.assign(this, partial)
  }
  id: string
  userId: string
  postId: string
  createdAt: Date
}
