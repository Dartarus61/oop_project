import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { LikeComment } from 'src/models/likeComments.model'
import { LikePost } from 'src/models/likePost.model'
import { LikeComController } from './likecom.controller'
import { LikePostController } from './likepost.controller'

@Module({
    controllers: [LikePostController, LikeComController],
    imports: [SequelizeModule.forFeature([LikePost, LikeComment])],
})
export class LikesystemModule {}
