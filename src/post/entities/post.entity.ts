import { Post } from '@prisma/client'
import { UserEntity } from 'src/user/entities/user.entity'

export class PostEntity implements Post {
  constructor(partial: Partial<PostEntity>) {
    Object.assign(this, partial)
  }
  id: string
  userId: string
  content: string
  imageUrl: string | null
  createdAt: Date
  likesCount: number
  repostsCount: number
  commentsCount: number
  user: UserEntity
}
