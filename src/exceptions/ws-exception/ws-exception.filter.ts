import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  BadRequestException,
  HttpStatus,
  HttpException,
} from '@nestjs/common'
import {
  WsBadRequestException,
  WsPrismaException,
  WsUnknownException,
} from './ws-exception'
import { Socket } from 'socket.io'
import { Prisma } from '@prisma/client'
import PRISMA_CODE from '../prisma-client-exception/prisma-codes'

@Catch()
export class WsExceptionFilter implements ExceptionFilter {
  private readonly _logger = new Logger(WsExceptionFilter.name)

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToWs()
    const client: Socket = ctx.getClient()
    let wsException:
      | WsBadRequestException
      | WsPrismaException
      | WsUnknownException

    if (
      exception instanceof BadRequestException ||
      exception instanceof HttpException
    ) {
      this._logger.log(exception.stack + '\n')
      const exceptionData = exception.getResponse()
      if (typeof exceptionData === 'object' && 'error' in exceptionData)
        delete exceptionData.error
      const exceptionMessage = exceptionData ?? exception.name
      if (typeof exceptionMessage === 'object')
        this._logger.debug(JSON.stringify(exceptionMessage) + '\n')
      else this._logger.debug(exceptionMessage + '\n')
      if (exception instanceof BadRequestException)
        wsException = new WsBadRequestException(exceptionMessage)
      else wsException = new WsUnknownException(exceptionMessage)
      client.emit('exception', wsException.getError())
      return
    }
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const message = exception.message.split('\n').at(-1)
      switch (true) {
        case PRISMA_CODE.NOT_FOUND.prismaCode.includes(exception.code):
          wsException = new WsPrismaException({
            message,
            statusCode: PRISMA_CODE.NOT_FOUND.returnStatusCode,
          })
          break
        case PRISMA_CODE.CONFLICT.prismaCode.includes(exception.code):
          wsException = new WsPrismaException({
            message,
            statusCode: PRISMA_CODE.CONFLICT.returnStatusCode,
          })
          break
        default:
          // default 500 error code
          wsException = new WsPrismaException({
            message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          })
          break
      }
      this._logger.log('Prisma Code: ' + exception.code)
      if (wsException) client.emit('exception', wsException.getError())
      return
    }
    this._logger.log(exception.stack + '\n')
    this._logger.debug(exception.message + '\n')
    wsException = new WsUnknownException(exception.message)
    client.emit('exception', wsException.getError())
  }
}
