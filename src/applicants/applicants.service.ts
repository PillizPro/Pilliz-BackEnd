import { Injectable, ConflictException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { ApplyToOfferDto } from './dto'
import { ApplicantEntity } from './entity/applicant.entity'

@Injectable()
export class ApplicantService {
  constructor(private readonly prismaService: PrismaService) {}

  async applyToOffer(applyToOfferDto: ApplyToOfferDto, userId: string) {
    const { offerId } = applyToOfferDto
    const existingApplication = await this.prismaService.applicants.findFirst({
      where: { offerId, userId },
    })

    if (existingApplication) {
      throw new ConflictException('User has already applied to this offer')
    }

    const newApplicant = await this.prismaService.applicants.create({
      data: {
        ...applyToOfferDto,
        userId,
      },
    })

    return new ApplicantEntity(newApplicant)
  }

  async getApplicantsByOffer(offerId: string) {
    try {
      const applicants = await this.prismaService.applicants.findMany({
        where: {
          offerId,
        },
      })

      if (applicants.length === 0) {
        return []
      }

      const foundUsers = await this.prismaService.users.findMany({
        where: {
          id: {
            in: applicants.map((applicant) => applicant.userId),
          },
        },
      })

      return applicants.map((applicant) => {
        const user = foundUsers.find((u) => u.id === applicant.userId)

        return {
          userId: user?.id,
          offerId: offerId,
          createdAt: applicant.createdAt,
          users: user,
        }
      })
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when fetching applicants')
    }
  }
}
