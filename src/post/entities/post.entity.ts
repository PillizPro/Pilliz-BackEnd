import { Post } from '@prisma/client'

export class PostEntity implements Post {
  constructor(partial: Partial<PostEntity>) {
    Object.assign(this, partial)
  }
  id: string
  userId: string
  content: string
  createdAt: Date
  likesCount: number
  comments: number
}
