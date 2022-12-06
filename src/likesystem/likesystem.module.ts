import { Module } from '@nestjs/common'
import { LikeComController } from './likecom.controller'
import { LikePostController } from './likepost.controller'

@Module({})
export class LikesystemModule {
    controllers: [LikePostController, LikeComController]
}
