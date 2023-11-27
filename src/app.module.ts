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
import { RepostModule } from './repost/repost.module'
import { CommentModule } from './comment/comment.module'
import { ImageUploadModule } from './image/image-upload.module'
import { ProductModule } from './product/product.module';

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
          : ENV === 'development'
          ? 'env-dev/.env.dev'
          : '',
      expandVariables: true,
      validationSchema: CONFIG_SCHEMA_VALIDATAION,
      validationOptions: {
        allowUnknowns: false,
        abortEarly: true,
      },
    }),
    PrismaModule,
    AuthModule,
    AdminModule,
    UserModule,
    PostModule,
    LikeModule,
    RepostModule,
    CommentModule,
    ImageUploadModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
