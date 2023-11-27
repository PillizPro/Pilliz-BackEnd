import { Comment } from '@prisma/client'
import { UserEntity } from 'src/user/entities/user.entity'

export class CommentEntity implements Comment {
  constructor(partial: Partial<CommentEntity>) {
    Object.assign(this, partial)
  }
  id: string
  content: string
  userId: string
  postId: string
  createdAt: Date
  likesCount: number
  repostsCount: number
  commentsCount: number
  user: UserEntity
}
