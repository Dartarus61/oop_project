import { forwardRef, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuthModule } from 'src/auth/auth.module'
import { Chapter } from 'src/models/chapter.model'
import { ChaptersModule } from 'src/chapters/chapters.module'
import { FilesModule } from 'src/files/files.module'
import { User } from 'src/models/user.model'
import { UserModule } from 'src/user/user.module'
import { PostController } from './post.controller'
import { UPost } from '../models/post.model'
import { PostService } from './post.service'
import { CommentModule } from 'src/comment/comment.module'
import { TokenModule } from 'src/token/token.module'

@Module({
    controllers: [PostController],
    providers: [PostService],
    imports: [
        forwardRef(() => ChaptersModule),
        SequelizeModule.forFeature([User, UPost, Chapter]),
        FilesModule,
        forwardRef(() => UserModule),
        forwardRef(() => CommentModule),
        JwtModule,
        AuthModule,
        TokenModule,
    ],
    exports: [PostService],
})
export class PostModule {}
