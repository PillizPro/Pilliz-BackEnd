import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnnouncementService {
    constructor(
        private readonly prismaService: PrismaService
      ) {}
    
    async getAllAnnouncements() {
        return await this.prismaService.announcement.findMany()
    }

    async createAnnouncement(announcement: any) {
        try {
            await this.prismaService.announcement.create({
                data: announcement,
            })
        } catch (error) {
            throw new Error('An error occurred when creating the announcement.')
        }
        return { message: 'Announcement successfully created.' }
    }

    async deleteAnnouncement(announcementId: string) {
        try {
            await this.prismaService.announcement.delete({
                where: { id: announcementId },
            });
            return { message: 'L\'annonce a été supprimée avec succès.' };
        } catch (error) {
            throw new Error('Une erreur est survenue lors de la suppression de l\'annonce.');
        }
    }

    async updateAnnouncement(announcementId: string, updateData: any) {
        try {
            await this.prismaService.announcement.update({
                where: { id: announcementId },
                data: { ...updateData, updatedAt: new Date() },
            });
            return { message: 'L\'annonce a été modifiée avec succès.' };
        } catch (error) {
            throw new Error('Une erreur est survenue lors de la modification de l\'annonce.');
        }
    }
}
