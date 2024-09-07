import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly _logger = new Logger(HttpExceptionFilter.name)

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()
    const message = exception.getResponse()

    this._logger.log(exception.stack + '\n')
    if (typeof message === 'object') {
      if ('error' in message) delete message.error
      this._logger.debug(JSON.stringify(message) + '\n')
      response.status(status).json({
        ...message,
        route: request.url,
      })
    } else {
      this._logger.debug(message + '\n')
      response.status(status).json({
        message,
        statusCode: status,
        route: request.url,
      })
    }
  }
}
