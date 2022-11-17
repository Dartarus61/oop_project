import { forwardRef, Module } from '@nestjs/common'
import { CommentService } from './comment.service'
import { CommentController } from './comment.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { Comment } from '../models/comment.model'
import { UPost } from 'src/models/post.model'
import { JwtModule } from '@nestjs/jwt'
import { PostModule } from 'src/post/post.module'

@Module({
    providers: [CommentService],
    controllers: [CommentController],
    imports: [SequelizeModule.forFeature([Comment, UPost]), JwtModule,forwardRef(()=>PostModule) ],
    exports: [CommentService],
})
export class CommentModule {}
