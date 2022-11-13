import { forwardRef, Module } from '@nestjs/common'
import { ChaptersService } from './chapters.service'
import { ChaptersController } from './chapters.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { Chapter } from '../models/chapter.model'
import { UPost } from 'src/models/post.model'
import { PostModule } from 'src/post/post.module'

@Module({
    providers: [ChaptersService],
    controllers: [ChaptersController],
    imports: [SequelizeModule.forFeature([Chapter]), forwardRef(() => PostModule)],
    exports: [ChaptersService],
})
export class ChaptersModule {}
