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

  async createFollowers(createFollowDto: CreateFollowDto, followerId: string) {
    const follow = await this.prismaService.follows.create({
      data: { followerId, ...createFollowDto },
    })
    this.eventEmitter.emit(
      'notifyUser',
      3,
      followerId,
      '',
      createFollowDto.followingId
    )
    return new FollowEntity(follow)
  }

  async deleteFollowers(deleteFollowDto: DeleteFollowDto, followerId: string) {
    try {
      await this.prismaService.follows.delete({
        where: {
          followerId_followingId: { followerId, ...deleteFollowDto },
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

  async getFollowers(userId: string) {
    const userFollowers = await this.prismaService.users.findUnique({
      where: {
        id: userId,
      },
      include: { followedBy: true },
    })
    if (userFollowers?.followedBy) {
      const allFollowers = await Promise.all(
        userFollowers.followedBy.map(async (follower) => {
          const userFollower = await this.prismaService.users.findUnique({
            where: { id: follower.followingId },
          })
          return {
            id: userFollower?.id,
            name: userFollower?.name,
          }
        })
      )
      return allFollowers
    }
    return
  }

  async isUserFollowBy(followerUid: string, followingUid: string) {
    const followingUser = await this.prismaService.follows.findMany({
      where: {
        followingId: followingUid,
        followerId: followerUid,
      },
    })

    if (followingUser.length === 0) return 1
    else return 0
  }
}
