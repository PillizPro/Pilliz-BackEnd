// image-upload.service.ts
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class DocumentUploadService {
  constructor(private readonly prismaService: PrismaService) {}

  async uploadUserDocument(userId: string, docName: string, docUrl: string) {
    try {
      const doc = await this.prismaService.document.findFirst({
        where: {
          userId: userId,
        },
      })

      // existe déjà, on le met à jour
      if (docName === doc?.docName) {
        await this.prismaService.document.update({
          where: {
            docName: docName,
          },
          data: {
            docUrl: docUrl,
            userId: userId,
          },
        })
      } else {
        await this.prismaService.document.create({
          data: {
            docName: docName,
            userId: userId,
            docUrl: docUrl,
          },
        })
      }

      const docs = await this.prismaService.document.findMany({
        where: {
          userId: userId,
        },
      })

      return docs
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when posting users document')
    }
  }

  async getUserDocuments(userId: string) {
    try {
      const docs = await this.prismaService.document.findMany({
        where: {
          userId: userId,
        },
      })

      return docs
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when getting user documents')
    }
  }

  // End Of Class
}
