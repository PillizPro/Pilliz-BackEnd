import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { ReportingPostCommentDto } from './dto/reporting-post-comment.dto'
import { ReportEntity } from './entities/report.entity'

@Injectable()
export class ReportService {
  constructor(private readonly prismaService: PrismaService) {}

  async reportPostComment(
    reportingPostComment: ReportingPostCommentDto,
    reportedBy: string
  ) {
    try {
      const { postId, commentId, reportedFor } = reportingPostComment
      const newReport = await this.prismaService.reports.create({
        data: {
          reportedBy,
          postId,
          commentId,
          reportedFor,
        },
      })

      return new ReportEntity(newReport)
    } catch (error) {
      console.error(error)
      throw new Error('An error occured when reporting')
    }
  }

  async recoverAllReports() {
    try {
      const reports = await this.prismaService.reports.findMany({
        include: {
          Users: true, // Inclure les données de l'utilisateur associé
          Post: true, // Inclure les données du post associé
          Comment: true, // Inclure les données du commentaire associé
        },
      })

      const transformedReports = reports.map((report) => ({
        reportedByUsername: report.Users.name, // Nom de l'utilisateur
        postContent: report.Post?.content, // Contenu du post
        commentContent: report.Comment?.content, // Contenu du commentaire
        reportedFor: report.reportedFor, // Type de signalement
        solved: report.solved, // Statut du signalement
        mesureTaken: report.mesureTaken, // Mesure prise
        createdAt: report.createdAt, // Date de création
      }))

      return transformedReports
    } catch (error) {
      console.error(error)
      throw new Error('An error occured when getting reports')
    }
  }
}
