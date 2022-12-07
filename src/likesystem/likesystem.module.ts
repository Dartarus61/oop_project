import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { LikeComment } from 'src/models/likeComments.model'
import { LikePost } from 'src/models/likePost.model'
import { LikeComController } from './likecom.controller'
import { likeComService } from './likecom.service'
import { LikePostController } from './likepost.controller'
import { likePostService } from './likepost.service'

@Module({
    controllers: [LikePostController, LikeComController],
    providers: [likeComService, likePostService],
    imports: [SequelizeModule.forFeature([LikePost, LikeComment])],
})
export class LikesystemModule {}
