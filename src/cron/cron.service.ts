import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Cron } from '@nestjs/schedule'
// import { CreateCronDto } from './dto/create-cron.dto';
// import { UpdateCronDto } from './dto/update-cron.dto';

@Injectable()
export class CronService {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly _loggerTest = new Logger(CronService.name)

  @Cron('0 0 3 * * 1-7')
  async handleCron() {
    this._loggerTest.debug('Called at 3am every day')
    return this.cron()
  }

  oneDay = 24 * 60 * 60 * 1000
  // const oneWeek = 7 * this.oneDay
  // const oneMonth = 30 * this.oneDay

  async cron() {
    const nbUsers = await this.prismaService.users.count()
    const nbPosts = await this.prismaService.post.count()
    const nbReposts = await this.prismaService.repost.count()
    const nbLikes = await this.prismaService.like.count()
    const nbComments = await this.prismaService.comment.count()
    const nbReplies = await this.prismaService.comment.count()
    const activeUsers = await this.prismaService.users.count({
      where: {
        updatedAt: {
          gte: new Date(Date.now() - this.oneDay),
        },
      },
    })

    const weekPosts = await this.prismaService.post.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - this.oneDay),
        },
      },
    })

    const weekComments = await this.prismaService.comment.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - this.oneDay),
        },
      },
    })

    const weekReposts = await this.prismaService.repost.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - this.oneDay),
        },
      },
    })

    const weekLikes = await this.prismaService.like.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - this.oneDay),
        },
      },
    })

    const weekReplies = await this.prismaService.comment.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - this.oneDay),
        },
      },
    })

    const insertStats = await this.prismaService.metrics.create({
      data: {
        numberOfUsers: nbUsers,
        numberOfPosts: nbPosts,
        numberOfLikes: nbLikes,
        numberOfReposts: nbReposts,
        numberOfComments: nbComments,
        numberOfReplies: nbReplies,
        weeklyNumberOfUsers: activeUsers,
        weeklyNumberOfPosts: weekPosts,
        weeklyNumberOfLikes: weekLikes,
        weeklyNumberOfReposts: weekReposts,
        weeklyNumberOfComments: weekComments,
        weeklyNumberOfReplies: weekReplies,
      },
    })
    return insertStats
  }
}
