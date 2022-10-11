import { Module } from '@nestjs/common'
import { ChaptersService } from './chapters.service'
import { ChaptersController } from './chapters.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { Chapter } from './chapter.model'
import { SubChapt } from './subchapters.model'
import { UPost } from 'src/post/post.model'
import { PostModule } from 'src/post/post.module'

@Module({
    providers: [ChaptersService],
    controllers: [ChaptersController],
    imports: [SequelizeModule.forFeature([Chapter]), PostModule],
    exports: [ChaptersService],
})
export class ChaptersModule {}
