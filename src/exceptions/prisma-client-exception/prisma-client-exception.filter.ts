import {
  ExceptionFilter,
  ArgumentsHost,
  Catch,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Request, Response } from 'express'
import PRISMA_CODE from './prisma-codes'

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  private readonly _logger = new Logger(PrismaClientExceptionFilter.name)

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const message = exception.message.split('\n').at(-1)
    let status: HttpStatus

    // See here for error reference: https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine
    switch (true) {
      case PRISMA_CODE.NOT_FOUND.prismaCode.includes(exception.code):
        status = PRISMA_CODE.NOT_FOUND.returnStatusCode
        response
          .status(status)
          .json({ message: message, statusCode: status, route: request.url })
        break
      case PRISMA_CODE.CONFLICT.prismaCode.includes(exception.code):
        status = PRISMA_CODE.CONFLICT.returnStatusCode
        response
          .status(status)
          .json({ message: message, statusCode: status, route: request.url })
        break
      default:
        // default 500 error code
        status = HttpStatus.INTERNAL_SERVER_ERROR
        response
          .status(status)
          .json({ message: message, statusCode: status, route: request.url })
        break
    }
    this._logger.log('Prisma Code: ' + exception.code)
  }
}
