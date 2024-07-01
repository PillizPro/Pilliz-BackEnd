import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { AdminModule } from './admin/admin.module'
import CONFIG_SCHEMA_VALIDATAION from './config.schema'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './user/user.module'
import { PostModule } from './post/post.module'
import { LikeModule } from './like/like.module'
import { ProfilModule } from './profil/profil.module'
import { FollowModule } from './follow/follow.module'
import { RepostModule } from './repost/repost.module'
import { ReportModule } from './report/report.module'
import { CommentModule } from './comment/comment.module'
import { ImageUploadModule } from './image/image-upload.module'
import { ProductModule } from './product/product.module'
import { WSModule } from './websocket/websocket.module'
import { PushNotificationModule } from './push-notification/push-notification.module'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { TagsModule } from './tags/tags.module'
import { TutorialsModule } from './tutorials/tutorials.module'
import { MetricModule } from './metric/metric.module'
import { IdentificationModule } from './identification/identification.module'
import { CronModule } from './cron/cron.module'
import { OfferModule } from './company-offer/offer.module'
import { BlockingModule } from './blocking/blocking.module'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './common/guards'

const ENV = process.env.NODE_ENV

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        ENV === 'production'
          ? 'env-prod/.env.prod'
          : ENV === 'staging'
          ? 'env-staging/.env.staging'
          : ENV === 'development' || ENV === 'test'
          ? 'env-dev/.env.dev'
          : '',
      expandVariables: true,
      validationSchema: CONFIG_SCHEMA_VALIDATAION,
      validationOptions: {
        allowUnknowns: false,
        abortEarly: true,
      },
    }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    AuthModule,
    AdminModule,
    UserModule,
    PostModule,
    LikeModule,
    ProfilModule,
    FollowModule,
    RepostModule,
    ReportModule,
    CommentModule,
    ImageUploadModule,
    ProductModule,
    WSModule,
    PushNotificationModule,
    TagsModule,
    TutorialsModule,
    MetricModule,
    IdentificationModule,
    CronModule,
    OfferModule,
    BlockingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
