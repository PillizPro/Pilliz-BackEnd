import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()
    const message = exception.getResponse()

    console.error(exception.stack, '\n')
    if (typeof message === 'object') {
      response.status(status).json({
        ...message,
        route: request.url,
      })
    } else {
      response.status(status).json({
        statusCode: status,
        message,
        route: request.url,
      })
    }
  }
}
