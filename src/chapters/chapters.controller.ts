import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/CreateChapter.dto';
import { CreateSubChapterDto } from './dto/CreateSubChapter.dto';

@Controller('chapters')
export class ChaptersController {
    constructor(private chapterService:ChaptersService){}

    @Post('/crch')
    CreateChapter(@Body() dto:CreateChapterDto) {
        return this.chapterService.CreateChapter(dto)
    }

    @Post('/crsubch')
    CreateSubChapter(@Body() dto:CreateSubChapterDto) {
        return this.chapterService.CreateSubChapter(dto)
    }

    @Get()
    GetAll(){
        return this.chapterService.getall()
    }
}
