import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { OnEvent } from '@nestjs/event-emitter'
import { request } from 'https'
import { PrismaService } from 'src/prisma/prisma.service'

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
        userThatNotify: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    await this.prismaService.notificatifion.updateMany({
      where: { userNotifiedId: userId },
      data: { read: true },
    })
    const transformedNotifications = notifications.map((notif) => {
      return {
        notifType: notif.notifType,
        id: notif.userThatNotifyId,
        name: notif.userThatNotify.name,
        image: notif.userThatNotify.profilPicture,
        time: 'null',
        content: notif.notifContent,
      }
    })
    return transformedNotifications
  }

  // notifType:
  //  0: a message has been sent
  //  1: a post has been liked
  //  2: a comment has been liked
  //  3: a user has been followed
  //  4: a user has repost a post
  //  5: a user has repost a comment
  @OnEvent('notifyUser')
  async notifyOnCreateChat(
    notifType: number,
    notifUserId: string,
    content: string,
    receiverId: string
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
    await this.prismaService.notificatifion.create({
      data: {
        notifType,
        userNotifiedId: receiverId,
        userThatNotifyId: notifUserId,
        notifContent: content,
      },
    })
    console.log(message)

    // return this.sendNotification(message)
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
