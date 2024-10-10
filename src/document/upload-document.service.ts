// image-upload.service.ts
import { BadRequestException, Injectable } from '@nestjs/common'
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class DocumentUploadService {
  constructor(private readonly prismaService: PrismaService) { }

  async uploadUserDocument(userId: string, docName: string, docUrl: string) {
    try {
      const nbDoc = await this.prismaService.document.findMany({
        where: {
          userId: userId,
        }
      })

      if (nbDoc.length == 10) {
        return -1;
      }

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

  async DeleteUserDocuments(_userId: string, _docName: string) {
    try {
      await this.prismaService.document.delete({
        where: {
          docName: _docName,
        }
      })
      return { message: 'Document succesfully deleted' }
    }
    catch (error) {
      console.error(error)
      throw new BadRequestException('An error occurred when deleting the post.')
    }
  }

  // End Of Class
}
