import { Module } from '@nestjs/common'
import { DocumentUploadService } from './upload-document.service'

@Module({
  providers: [DocumentUploadService],
  exports: [DocumentUploadService],
})
export class DocumentUploadModule {}
