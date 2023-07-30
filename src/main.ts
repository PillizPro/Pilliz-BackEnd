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

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  })
  // eslint-disable-next-line @typescript-eslint/naming-convention
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
  await app.listen(3000)
}
bootstrap()
