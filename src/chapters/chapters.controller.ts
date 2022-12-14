import { Body, Controller, Delete, Get, HttpStatus, Param, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UPost } from 'src/models/post.model'
import { PostService } from 'src/post/post.service'
import { Chapter } from '../models/chapter.model'
import { ChaptersService } from './chapters.service'
import { CreateChapterDto } from './dto/CreateChapter.dto'
import { CreateSubChapterDto } from './dto/CreateSubChapter.dto'

@ApiTags('Разделы и подразделы')
@Controller('chapter')
export class ChaptersController {
    constructor(private chapterService: ChaptersService, private postService: PostService) {}

    @ApiOperation({ summary: 'Создание раздела' })
    @ApiResponse({ status: 201, type: Chapter })
    @Post('/crch')
    CreateChapter(@Body() dto: CreateChapterDto) {
        return this.chapterService.CreateChapter(dto)
    }

    @ApiOperation({ summary: 'Главы и их подглавы' })
    @ApiResponse({ status: HttpStatus.CREATED, type: [Chapter] })
    @Get('/menu')
    GetMenu() {
        return this.chapterService.GetMenu()
    }

    @Get('/')
    GetChapters() {
        return this.chapterService.GetAllChapters()
    }

    @ApiOperation({ summary: 'Получение подглав по имени главы' })
    @Get('/subs/:value')
    GetSubchapter(@Param('value') value: string) {
        return this.chapterService.GetSubChapterByChapterName(value)
    }

    @ApiOperation({ summary: 'Удаление главы' })
    @Delete('/delch/:name')
    DeleteChapter(@Param('name') name: string) {
        return this.chapterService.deleteChapter(name)
    }
}
