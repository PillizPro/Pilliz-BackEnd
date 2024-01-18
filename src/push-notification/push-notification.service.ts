import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { OnEvent } from '@nestjs/event-emitter'
import { request } from 'https'

@Injectable()
export class PushNotificationService {
  constructor(private readonly configService: ConfigService) {}

  @OnEvent('createChat')
  notifyOnCreateChat({
    userName,
    content,
  }: {
    userName: string
    content: string
  }) {
    console.log(userName, content)
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
