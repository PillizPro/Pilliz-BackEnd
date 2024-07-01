import { Document } from '@prisma/client'

export class DocumentEntity implements Document {
  constructor(partial: Partial<DocumentEntity>) {
    Object.assign(this, partial)
  }
  userId: string
  docName: string
  docUrl: string
}
