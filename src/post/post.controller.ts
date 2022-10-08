import { Body, Controller, Get, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express'
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Roles } from 'src/auth/roles-auth.decorator'
import { CreatePostDto } from './dto/create-post.dto'
import { GetGroupOffers } from './dto/getGroupOffers.dto'
import { PostService } from './post.service'
import { UPost } from './post.model'
import { FilesService } from 'src/files/files.service'

@ApiTags('Статьи')
@Controller('post')
export class PostController {
    constructor(private postService: PostService,
        private fileService:FilesService) {}

    @ApiOperation({ summary: 'Создание статьи' })
    @ApiResponse({ status: 201, type: UPost })
    @Roles('USER', 'ADMIN')
    @Post('/create')
    @UseInterceptors(AnyFilesInterceptor())
    createPost(@Body() dto: CreatePostDto, @UploadedFiles() files?: Array<Express.Multer.File>) {
        console.log(files)

        return this.postService.createPost(dto, files)

        // return this.postService.CreateSimpePost(dto)
    }

    @ApiOperation({ summary: 'Получение статей по ID пользователя' })
    @ApiResponse({ status: 201, type: [UPost] })
    @Roles('USER', 'ADMIN')
    @Post('/getoff')
    GetOffers(@Body('id') id: number) {
        return this.postService.GetOffersByUserId(id)
    }

    @ApiOperation({ summary: 'Получение статей по главам' })
    @ApiResponse({ status: 201, type: [UPost] })
    @Roles('USER', 'ADMIN')
    @Post('/getgroup')
    GetGroupOffers(@Body() chapter: string) {
        return this.postService.GetGroupOffersByModule(chapter)
    }

    @Get('/download')
    GetFiles(@Query('filename') name:string) {
        return this.fileService.GetFileToUser(name)
    }
}
