import { Body, Controller, Get, Post } from '@nestjs/common'
import { AnnouncementService } from './announcement.service'

@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get('getAllAnnouncements')
  async getAllAnnouncements() {
    return await this.announcementService.getAllAnnouncements()
  }

  @Post('createAnnouncement')
  async createAnnouncement(@Body() announcement: any) {
    return await this.announcementService.createAnnouncement(announcement)
  }

  @Post('deleteAnnouncement')
  async deleteAnnouncement(@Body() body: { announcementId: string }) {
    const announcementId = body.announcementId
    return await this.announcementService.deleteAnnouncement(announcementId)
  }

  @Post('updateAnnouncement')
  async updateAnnouncement(
    @Body() body: { announcementId: string; updateData: any }
  ) {
    const { announcementId, updateData } = body
    return await this.announcementService.updateAnnouncement(
      announcementId,
      updateData
    )
  }
}
