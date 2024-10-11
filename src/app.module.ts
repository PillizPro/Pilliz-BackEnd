import { Module } from '@nestjs/common'
import { CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager'
import { redisStore } from 'cache-manager-redis-store'
import { WSModule } from './websocket/websocket.module'
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
import { PushNotificationModule } from './push-notification/push-notification.module'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { TagsModule } from './tags/tags.module'
import { TutorialsModule } from './tutorials/tutorials.module'
import { MetricModule } from './metric/metric.module'
import { IdentificationModule } from './identification/identification.module'
import { CronModule } from './cron/cron.module'
import { OfferModule } from './company-offer/offer.module'
import { ApplicantModule } from './applicants/applicant.module'
import { BlockingModule } from './blocking/blocking.module'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './common/guards'

const ENV = process.env.NODE_ENV

export const REDIS_OPTIONS: CacheModuleAsyncOptions = {
  isGlobal: true,
  useFactory: async () => {
    const store = await redisStore({
      url: process.env.REDIS_URL,
    })
    return {
      store: () => store,
      ttl: 86400000, // 1 day (remove this if you dont want to clear cache automatically)
    }
  },
}

@Module({
  imports: [
    CacheModule.registerAsync(REDIS_OPTIONS),
    WSModule,
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
    PushNotificationModule,
    TagsModule,
    TutorialsModule,
    MetricModule,
    IdentificationModule,
    CronModule,
    OfferModule,
    ApplicantModule,
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
