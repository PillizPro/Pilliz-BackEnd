import { NestFactory, HttpAdapterHost, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common'
import { PrismaClientExceptionFilter } from './exceptions/prisma-client-exception/prisma-client-exception.filter'
import { HttpExceptionFilter } from './exceptions/http-exception/http-exception.filter'
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger'
import * as express from 'express'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.useGlobalFilters(
    new PrismaClientExceptionFilter(app.get(HttpAdapterHost)),
    new HttpExceptionFilter()
  )
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Pilliz API')
    .setDescription('Documentation of the Pilliz API')
    .setContact(
      'Pilliz',
      'https://github.com/PillizPro/Pilliz-BackEnd',
      'pilliz.pro@gmail.com'
    )
    .setVersion('1')
    .build()
  const swaggerOptions: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  }
  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    swaggerOptions
  )
  SwaggerModule.setup('api/doc', app, document)
  app.use(express.json({ limit: '50mb' })) // Augmentez selon vos besoins
  app.use(express.urlencoded({ limit: '50mb', extended: true }))
  await app.listen(3000)
}
bootstrap()
