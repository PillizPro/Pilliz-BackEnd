import { Message } from '@prisma/client'

export class ChatEntity implements Message {
  constructor(partial: Partial<ChatEntity>) {
    Object.assign(this, partial)
  }
  id: string
  authorId: string
  receiverId: string
  createdAt: Date
  content: string
  conversationId: string
  status: number
  type: number
}
