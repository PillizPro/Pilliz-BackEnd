// image-upload.service.ts
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { DocumentEntity } from './entities/document.entity'

@Injectable()
export class DocumentUploadService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async uploadUserDocument(_userId: string, _docName: string, _docUrl: string) {
    try {
      const doc = await this.prismaService.document.findFirst({
        where: {
          userId: _userId
        }
      })

      // existe déjà, on le met à jour
      if (_docName == doc?.docName) {
        await this.prismaService.document.update({
          where: {
            docName: _docName
          },
          data: {
            docUrl: _docUrl,
            userId: _userId
          }
        })
      }
      else {
        await this.prismaService.document.create({
          data: {
            docName: _docName,
            userId: _userId,
            docUrl: _docUrl,
          }
        })
      }

      const docs = await this.prismaService.document.findMany({
        where: {
          userId: _userId
        }
      });

      return docs;
    }
    catch (error) {
      console.error(error)
      throw new Error('An error occurred when posting users document')
    }
  }

  async getUserDocuments(_userId: string) {
    try {
      const docs = await this.prismaService.document.findMany({
        where: {
          userId: _userId
        }
      });

      return docs;
    }
    catch (error) {
      console.error(error)
      throw new Error('An error occurred when getting user documents')
    }
  }

  // End Of Class
}
