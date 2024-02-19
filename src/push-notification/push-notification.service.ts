import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { OnEvent } from '@nestjs/event-emitter'
import { request } from 'https'
import { PrismaService } from 'src/prisma/prisma.service'
import NotifType from 'src/utils/enum/notif-type'

@Injectable()
export class PushNotificationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService
  ) {}

  async getAllNotifications(userId: string) {
    const notifications = await this.prismaService.notificatifion.findMany({
      where: { userNotifiedId: userId },
      include: {
        UsersThatNotify: true,
        MessageSent: true,
        PostLiked: true,
        CommentLiked: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    await this.prismaService.notificatifion.updateMany({
      where: { userNotifiedId: userId },
      data: { read: true },
    })
    const transformedNotifications = notifications.map((notif) => {
      let content: string | undefined = ''
      if (notif.messageSentId) content = notif.MessageSent?.content
      if (notif.postLikedId) content = notif.PostLiked?.content
      if (notif.commentLikedId) content = notif.CommentLiked?.content
      return {
        notifType: notif.notifType,
        users: notif.UsersThatNotify.map((user) => {
          return {
            name: user.name,
            image: user.profilPicture,
          }
        }),
        time: 'null',
        content: content,
      }
    })
    return transformedNotifications
  }

  // notifType:
  //  0: a message has been sent
  //  1: a post has been liked
  //  2: a comment has been liked
  //  3: a user has been followed
  @OnEvent('notifyUser')
  async notifyOnCreateChat(
    notifType: NotifType,
    notifUserId: string,
    content: string,
    receiverId: string,
    actionId: string
  ) {
    const user = await this.prismaService.users.findUnique({
      where: { id: notifUserId },
    })
    console.log(notifType, notifUserId, content, receiverId, '|', user?.name)
    const message = {
      app_id: this.configService.get('ONESIGNAL_APP_ID'),
      contents: { fr: content },
      included_segments: ['All'],
      content_available: true,
      small_icon: 'ic_notification_icon',
      data: {
        PushTitle: 'Custom Notification',
      },
    }
    this.upsertNotification(notifType, notifUserId, receiverId, actionId)
    console.log(message)

    // return this.sendNotification(message)
  }

  async upsertNotification(
    notifType: NotifType,
    notifUserId: string,
    receiverId: string,
    actionId: string
  ) {
    let whereClause: any = null
    let id: string = ''
    switch (notifType) {
      case NotifType.MESSAGE_SENT:
        whereClause = { messageSentId: actionId }
        id = 'messageSentId'
        break
      case NotifType.POST_LIKED:
        whereClause = { postLikedId: actionId }
        id = 'postLikedId'
        break
      case NotifType.COMMENT_LIKED:
        whereClause = { commentLikedId: actionId }
        id = 'commentLikedId'
        break
      case NotifType.USER_FOLLOWED:
        whereClause = { userFollowedId: actionId }
        id = 'userFollowedId'
        break
      default:
        break
    }
    await this.prismaService.notificatifion.upsert({
      where: whereClause,
      create: {
        [id]: actionId,
        notifType: notifType,
        UsersThatNotify: { connect: { id: notifUserId } },
        userNotifiedId: receiverId,
      },
      update: { UsersThatNotify: { connect: { id: notifUserId } } },
    })
  }

  sendNotification(message: any) {
    this._sendNotification(message, (error: any, results: any) => {
      if (error) {
        throw Error('An error occured when sending a notification')
      }
      return { message: 'Success', data: results }
    })
  }

  private async _sendNotification(data: any, callback: any) {
    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: 'Basic ' + this.configService.get('ONESIGNAL_API_KEY'),
    }

    const options = {
      host: 'onesignal.com',
      port: 443,
      path: '/api/v1/notifications',
      method: 'POST',
      headers: headers,
    }

    const req = request(options, function (res) {
      res.on('data', function (data) {
        console.log(JSON.parse(data))
        return callback(null, JSON.parse(data))
      })
    })

    req.on('error', function (e) {
      return callback({
        message: e,
      })
    })

    req.write(JSON.stringify(data))
    req.end()
  }
}
