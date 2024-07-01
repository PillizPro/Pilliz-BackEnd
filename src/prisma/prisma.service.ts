import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Prisma, PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly _logger = new Logger(PrismaService.name)

  async onModuleInit() {
    await this.$connect()

    this.$on('error', ({ message }) => {
      this._logger.error(message)
    })
    this.$on('warn', ({ message }) => {
      this._logger.warn(message)
    })
    this.$on('info', ({ message }) => {
      this._logger.debug(message)
    })
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }

  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
      log: [
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    })
  }
}

@Injectable()
export class PrismaServiceForGHA {}
