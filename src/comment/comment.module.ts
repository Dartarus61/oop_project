import { Module } from '@nestjs/common'
import { CommentService } from './comment.service'
import { CommentController } from './comment.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { Comment } from '../models/comment.model'
import { UPost } from 'src/models/post.model'
import { JwtModule } from '@nestjs/jwt'

@Module({
    providers: [CommentService],
    controllers: [CommentController],
    imports: [SequelizeModule.forFeature([Comment, UPost]), JwtModule],
    exports: [CommentService],
})
export class CommentModule {}
