import { Body, Controller, Post, Get } from '@nestjs/common'
import { ReportingPostCommentDto } from './dto/reporting-post-comment.dto'
import { ReportService } from './report.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Reports')
@Controller('reporting')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('reportingPostOrComment')
  async reportPostComment(
    @Body() reportingPostComment: ReportingPostCommentDto
  ) {
    return await this.reportService.reportPostComment(reportingPostComment)
  }

  @Get('recoverAllReports')
  async recoverAllReports() {
    return await this.reportService.recoverAllReports()
  }
}
