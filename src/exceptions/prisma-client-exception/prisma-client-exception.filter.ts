import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { Prisma } from '@prisma/client'
import { Request, Response } from 'express'

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const message = exception.message.split('\n').at(-1)
    let status: HttpStatus

    console.error(exception.message, '\n')
    // See here for error reference: https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine
    switch (exception.code) {
      case 'P2001' || 'P2021' || 'P2022' || 'P2025':
        status = HttpStatus.NOT_FOUND
        response
          .status(status)
          .json({ statusCode: status, message: message, route: request.url })
        break
      case 'P2002' || 'P2003' || 'P2004':
        status = HttpStatus.CONFLICT
        response
          .status(status)
          .json({ statusCode: status, message: message, route: request.url })
        break
      default:
        // default 500 error code
        super.catch(exception, host)
        break
    }
  }
}
