import { Reports } from '@prisma/client'
import { UserEntity } from 'src/user/entities/user.entity'
import { PostEntity } from 'src/post/entities/post.entity'
import { CommentEntity } from 'src/comment/entities/comment.entity'

export class ReportEntity implements Reports {
  constructor(partial: Partial<ReportEntity>) {
    Object.assign(this, partial)
  }
  id: string
  reportedBy: string
  postId: string | null
  commentId: string | null
  reportedFor: string
  solved: boolean
  mesureTaken: string
  createdAt: Date
  user: UserEntity
  post: PostEntity
  comment: CommentEntity
}
