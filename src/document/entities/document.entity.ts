import { Document } from '@prisma/client'
import { UserEntity } from 'src/user/entities/user.entity'

export class DocumentEntity implements Document {
  constructor(partial: Partial<DocumentEntity>) {
    Object.assign(this, partial)
  }
  userId: string;
  docName: string;
  docUrl: string;
}
