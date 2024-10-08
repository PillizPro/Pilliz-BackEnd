import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateCompanyOfferDto } from './dto'
import { OfferEntity } from './entities/offer.entity'

@Injectable()
export class OfferService {
  constructor(private readonly prismaService: PrismaService) {}

  async companyPostByUser(
    createCompanyOfferDto: CreateCompanyOfferDto,
    userId: string
  ) {
    const { tagsList } = createCompanyOfferDto

    try {
      const newOffer = await this.prismaService.companyOffer.create({
        data: {
          userId,
          ...createCompanyOfferDto,
        },
      })

      if (tagsList) {
        const tags = await Promise.all(
          tagsList.map((tagName) =>
            this.prismaService.tags.findUnique({
              where: { name: tagName },
            })
          )
        )

        if (tags.includes(null))
          throw new NotFoundException('One or more tags do not exist.')

        await this.prismaService.companyOffer.update({
          where: { id: newOffer.id },
          data: {
            Tags: {
              connect: tagsList.map((tag) => ({
                name: tag,
              })),
            },
          },
        })
      }

      return new OfferEntity(newOffer)
    } catch (error) {
      console.error(error)
      throw new BadRequestException('An error occurred when creating an offer.')
    }
  }

  async findAllPosts() {
    try {
      const offers = await this.prismaService.companyOffer.findMany({
        include: {
          Users: true, // Inclure les données de l'utilisateur associé
          Tags: true, // Inclure les données des tags associés
        },
      })

      const transformedOffers = offers.map((offer) => ({
        userId: offer.userId, // ID du user
        offerId: offer.id, // ID du offer
        username: offer.Users.name, // Nom de l'utilisateur
        content: offer.content, // Contenu du offer
        createdAt: offer.createdAt, // Date de création
        companyOfferTitle: offer.companyOfferTitle,
        companyOfferDiploma: offer.companyOfferDiploma,
        companyOfferSkills: offer.companyOfferSkills,
        companyOfferContractType: offer.companyOfferContractType,
        companyOfferContractDuration: offer.companyOfferContractDuration,
        companyOfferSalary: offer.companyOfferSalary,
        tags: offer.Tags.map((tag) => tag.name),
      }))

      return transformedOffers
    } catch (error) {
      console.error(error)
      throw new BadRequestException('An error occured when getting offers.')
    }
  }

  async find20RecentUserOffers(userId: string) {
    try {
      const offers = await this.prismaService.companyOffer.findMany({
        where: {
          userId: userId,
        },
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
          Users: true,
          Tags: true,
        },
      })

      // Transform the retrieved offers into the desired format
      const transformedOffers = offers.map((offer) => ({
        userId: offer.userId,
        offerId: offer.id,
        username: offer.Users.name,
        content: offer.content,
        createdAt: offer.createdAt,
        companyOfferTitle: offer.companyOfferTitle,
        companyOfferDiploma: offer.companyOfferDiploma,
        companyOfferSkills: offer.companyOfferSkills,
        companyOfferContractType: offer.companyOfferContractType,
        companyOfferContractDuration: offer.companyOfferContractDuration,
        companyOfferSalary: offer.companyOfferSalary,
        tags: offer.Tags.map((tag) => tag.name),
      }))

      return transformedOffers
    } catch (error) {
      console.error(error)
      throw new BadRequestException(
        "An error occurred when getting user's offers."
      )
    }
  }

  async find20MoreRecentOffers(userId: string, dateString: string) {
    try {
      const offers = await this.prismaService.companyOffer.findMany({
        take: 20,
        where: {
          userId: userId,
          createdAt: {
            lt: dateString,
          },
        },
        orderBy: { createdAt: 'desc' },
        include: {
          Users: true,
          Tags: true,
        },
      })

      // Transform the retrieved offers into the desired format
      const transformedOffers = offers.map((offer) => ({
        userId: offer.userId,
        offerId: offer.id,
        username: offer.Users.name,
        content: offer.content,
        createdAt: offer.createdAt,
        companyOfferTitle: offer.companyOfferTitle,
        companyOfferDiploma: offer.companyOfferDiploma,
        companyOfferSkills: offer.companyOfferSkills,
        companyOfferContractType: offer.companyOfferContractType,
        companyOfferContractDuration: offer.companyOfferContractDuration,
        companyOfferSalary: offer.companyOfferSalary,
        tags: offer.Tags.map((tag) => tag.name),
      }))

      return transformedOffers
    } catch (error) {
      console.error(error)
      throw new BadRequestException(
        'An error occurred when getting more offers.'
      )
    }
  }

  async deleteOffer(offerId: string, userId: string) {
    try {
      const offer = await this.prismaService.companyOffer.findUnique({
        where: {
          id: offerId,
        },
      })

      if (!offer || offer.userId !== userId) {
        throw new UnauthorizedException(
          'You are not allowed to delete this offer.'
        )
      }

      await this.prismaService.companyOffer.delete({
        where: {
          id: offerId,
        },
      })

      return 'Post deleted successfully'
    } catch (error) {
      console.error(error)
      throw new BadRequestException(
        'An error occurred when deleting the offer.'
      )
    }
  }
}
