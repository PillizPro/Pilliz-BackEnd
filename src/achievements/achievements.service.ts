import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class AchievementsService {
  constructor(private readonly prisma: PrismaService) {}

  async checkLikesAchievements(userId: string) {
    let likesForAchievements = 0
    const likeReturnValue = []
    const allLikesAchievements = [
      {
        type: '10_likes',
        message: 'Vous avez obtenu le succès "Obtenir 10 likes" !',
        imageAchievements:
          'https://res.cloudinary.com/defykajh0/image/upload/v1725444427/ImageAchievements/10_likes_xmbhrh.png',
      },
      {
        type: '100_likes',
        message: 'Vous avez obtenu le succès "Obtenir 100 likes" !',
        imageAchievements:
          'https://res.cloudinary.com/defykajh0/image/upload/v1725444427/ImageAchievements/100_likes_xl6kpi.png',
      },
      {
        type: '1000_likes',
        message: 'Vous avez obtenu le succès "Obtenir 1000 likes" !',
        imageAchievements:
          'https://res.cloudinary.com/defykajh0/image/upload/v1725444427/ImageAchievements/1000_likes_dtiwai.png',
      },
    ]

    const validatedAchievements = await this.prisma.achievements.findMany({
      where: {
        userId: userId,
      },
    })

    const validatedAchievementsSet = new Set(
      validatedAchievements.map((a) => a.achievements)
    )

    for (const verification of allLikesAchievements) {
      if (!validatedAchievementsSet.has(verification.type)) {
        const userLikesPosts = await this.prisma.post.findMany({
          where: { userId: userId },
        })

        const userLikesComments = await this.prisma.comment.findMany({
          where: { userId: userId },
        })

        if (verification.type === '10_likes') {
          likesForAchievements = 10
        } else if (verification.type === '100_likes') {
          likesForAchievements = 100
        } else if (verification.type === '1000_likes') {
          likesForAchievements = 1000
        }

        let cumulatedLikes = 0
        for (const post of userLikesPosts) {
          cumulatedLikes += post.likesCount
        }

        for (const comment of userLikesComments) {
          cumulatedLikes += comment.likesCount
        }

        if (cumulatedLikes >= likesForAchievements) {
          await this.prisma.achievements.create({
            data: {
              userId: userId,
              achievements: verification.type,
            },
          })
          likeReturnValue.push({
            message: verification.message,
            type: verification.type,
            imageAchievements: verification.imageAchievements,
          })
        }
      }
    }
    return likeReturnValue
  }

  async checkRepostsAchievements(userId: string) {
    let repostsForAchievements = 0
    const repostReturnValue = []
    const allRepostsAchievements = [
      {
        type: '10_reposts',
        message: 'Vous avez obtenu le succès "Obtenir 10 reposts" !',
        imageAchievements:
          'https://res.cloudinary.com/defykajh0/image/upload/v1725444427/ImageAchievements/10_reposts_rx4ibv.png',
      },
      {
        type: '100_reposts',
        message: 'Vous avez obtenu le succès "Obtenir 100 reposts" !',
        imageAchievements:
          'https://res.cloudinary.com/defykajh0/image/upload/v1725444427/ImageAchievements/100_reposts_pdphoq.png',
      },
      {
        type: '1000_reposts',
        message: 'Vous avez obtenu le succès "Obtenir 1000 reposts" !',
        imageAchievements:
          'https://res.cloudinary.com/defykajh0/image/upload/v1725444428/ImageAchievements/1000_reposts_fojxpy.png',
      },
    ]

    const validatedAchievements = await this.prisma.achievements.findMany({
      where: {
        userId: userId,
      },
    })

    const validatedAchievementsSet = new Set(
      validatedAchievements.map((a) => a.achievements)
    )

    for (const verification of allRepostsAchievements) {
      if (!validatedAchievementsSet.has(verification.type)) {
        const userRepostsPosts = await this.prisma.post.findMany({
          where: { userId: userId },
        })

        const userRepostsComments = await this.prisma.comment.findMany({
          where: { userId: userId },
        })

        let cumulatedReposts = 0

        if (verification.type === '10_reposts') {
          repostsForAchievements = 10
        } else if (verification.type === '100_reposts') {
          repostsForAchievements = 100
        } else if (verification.type === '1000_reposts') {
          repostsForAchievements = 1000
        }

        for (const posts of userRepostsPosts) {
          cumulatedReposts += posts.repostsCount
        }

        for (const comments of userRepostsComments) {
          cumulatedReposts += comments.repostsCount
        }

        if (cumulatedReposts >= repostsForAchievements) {
          await this.prisma.achievements.create({
            data: {
              userId: userId,
              achievements: verification.type,
            },
          })

          repostReturnValue.push({
            message: verification.message,
            type: verification.type,
            imageAchievements: verification.imageAchievements,
          })
        }
      }
    }

    return repostReturnValue
  }

  async checkInterractionsAchievements(userId: string) {
    let interractionsForAchievements = 0
    const interractionsReturnValue = []
    const allInterractionsAchievement = [
      {
        type: '100_interractions',
        message: 'Vous avez obtenu le succès "Obtenir 100 interractions" !',
        imageAchievements:
          'https://res.cloudinary.com/defykajh0/image/upload/v1725444427/ImageAchievements/100_interractions_rxcxzd.png',
      },
      {
        type: '1000_interractions',
        message: 'Vous avez obtenu le succès "Obtenir 1000 interractions" !',
        imageAchievements:
          'https://res.cloudinary.com/defykajh0/image/upload/v1725444427/ImageAchievements/1000_interractions_awma8r.png',
      },
      {
        type: '10000_interractions',
        message: 'Vous avez obtenu le succès "Obtenir 10000 interractions" !',
        imageAchievements:
          'https://res.cloudinary.com/defykajh0/image/upload/v1725444428/ImageAchievements/10000_interractions_vquewj.png',
      },
    ]

    const validatedAchievements = await this.prisma.achievements.findMany({
      where: {
        userId: userId,
      },
    })

    const validatedAchievementsSet = new Set(
      validatedAchievements.map((a) => a.achievements)
    )

    for (const verification of allInterractionsAchievement) {
      if (!validatedAchievementsSet.has(verification.type)) {
        const userInterrractionsPosts = await this.prisma.post.findMany({
          where: { userId: userId },
        })

        let cumulatedInterractions = 0
        if (verification.type === '100_interractions') {
          interractionsForAchievements = 100
        } else if (verification.type === '1000_interractions') {
          interractionsForAchievements = 1000
        } else if (verification.type === '10000_interractions') {
          interractionsForAchievements = 10000
        }

        for (const post of userInterrractionsPosts) {
          cumulatedInterractions += post.totalInteractions
        }

        if (cumulatedInterractions >= interractionsForAchievements) {
          await this.prisma.achievements.create({
            data: {
              userId: userId,
              achievements: verification.type,
            },
          })

          interractionsReturnValue.push({
            message: verification.message,
            type: verification.type,
            imageAchievements: verification.imageAchievements,
          })
        }
      }
    }

    return interractionsReturnValue
  }

  async recoverAllAchievements(userId: string) {
    const recoveredAchievements = []

    const detailsAchievements = [
      {
        number: 1,
        type: '10_likes',
        message: 'Obtenir 10 likes',
        imageAchievements:
          'https://res.cloudinary.com/defykajh0/image/upload/v1725444427/ImageAchievements/10_likes_xmbhrh.png',
      },
      {
        number: 2,
        type: '100_likes',
        message: 'Obtenir 100 likes',
        imageAchievements:
          'https://res.cloudinary.com/defykajh0/image/upload/v1725444427/ImageAchievements/100_likes_xl6kpi.png',
      },
      {
        number: 3,
        type: '1000_likes',
        message: 'Obtenir 1000 likes',
        imageAchievements:
          'https://res.cloudinary.com/defykajh0/image/upload/v1725444427/ImageAchievements/1000_likes_dtiwai.png',
      },
      {
        number: 4,
        type: '10_reposts',
        message: 'Obtenir 10 reposts',
        imageAchievements:
          'https://res.cloudinary.com/defykajh0/image/upload/v1725444427/ImageAchievements/10_reposts_rx4ibv.png',
      },
      {
        number: 5,
        type: '100_reposts',
        message: 'Obtenir 100 reposts',
        imageAchievements:
          'https://res.cloudinary.com/defykajh0/image/upload/v1725444427/ImageAchievements/100_reposts_pdphoq.png',
      },
      {
        number: 6,
        type: '1000_reposts',
        message: 'Obtenir 1000 reposts',
        imageAchievements:
          'https://res.cloudinary.com/defykajh0/image/upload/v1725444428/ImageAchievements/1000_reposts_fojxpy.png',
      },
      {
        number: 7,
        type: '100_interractions',
        message: 'Obtenir 100 interractions',
        imageAchievements:
          'https://res.cloudinary.com/defykajh0/image/upload/v1725444427/ImageAchievements/100_interractions_rxcxzd.png',
      },
      {
        number: 8,
        type: '1000_interractions',
        message: 'Obtenir 1000 interractions',
        imageAchievements:
          'https://res.cloudinary.com/defykajh0/image/upload/v1725444427/ImageAchievements/1000_interractions_awma8r.png',
      },
      {
        number: 9,
        type: '10000_interractions',
        message: 'Obtenir 10000 interractions',
        imageAchievements:
          'https://res.cloudinary.com/defykajh0/image/upload/v1725444428/ImageAchievements/10000_interractions_vquewj.png',
      },
    ]

    const achievementsOfUser = await this.prisma.achievements.findMany({
      where: { userId: userId },
    })

    const achievementsOfUserSet = new Set(
      achievementsOfUser.map((a) => a.achievements)
    )

    for (const checker of detailsAchievements) {
      if (achievementsOfUserSet.has(checker.type)) {
        recoveredAchievements.push({
          number: checker.number,
          type: checker.type,
          message: checker.message,
          imageAchievements: checker.imageAchievements,
          isUnlocked: true,
        })
      } else {
        recoveredAchievements.push({
          number: checker.number,
          type: checker.type,
          message: checker.message,
          imageAchievements: checker.imageAchievements,
          isUnlocked: false,
        })
      }
    }

    recoveredAchievements.sort((a, b) => a.number - b.number)
    return recoveredAchievements
  }
}
