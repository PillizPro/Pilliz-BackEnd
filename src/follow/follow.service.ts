import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateFollowDto } from './dto/create-follow.dto'
import { FollowEntity } from './entities/follow.entity'
import { DeleteFollowDto } from './dto/delete-follow.dto'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class FollowService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async createFollowers(createFollowDto: CreateFollowDto) {
    const follow = await this.prismaService.follows.create({
      data: createFollowDto,
      include: { follower: true },
    })
    this.eventEmitter.emit(
      'notifyOnFollow',
      createFollowDto.followingId,
      follow.follower.name
    )
    return new FollowEntity(follow)
  }

  async deleteFollowers(deleteFollowDto: DeleteFollowDto) {
    try {
      await this.prismaService.follows.delete({
        where: {
          followerId_followingId: deleteFollowDto,
        },
      })
      return { message: 'Followers successfully unfollow' }
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred when deleting the user.')
    }
  }

  async getNbFollowers(userId: string) {
    const userNbFollowers = await this.prismaService.follows.count({
      where: {
        followerId: userId,
      },
    })
    return userNbFollowers
  }

  async getNbFollowing(userId: string) {
    const userNbFollowing = await this.prismaService.follows.count({
      where: {
        followingId: userId,
      },
    })
    return userNbFollowing
  }
}
