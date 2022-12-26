import {
    Body,
    Controller,
    Get,
    Headers,
    Param,
    Post,
    Query,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express'
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Roles } from 'src/auth/roles-auth.decorator'
import { CreatePostDto } from './dto/create-post.dto'
import { GetGroupOffers } from './dto/getGroupOffers.dto'
import { PostService } from './post.service'
import { UPost } from '../models/post.model'
import { FilesService } from 'src/files/files.service'
import { RolesGuard } from 'src/auth/roles.guard'

@ApiTags('Статьи')
@Controller('post')
export class PostController {
    constructor(private postService: PostService, private fileService: FilesService) {}

    @ApiOperation({ summary: 'Создание статьи' })
    @ApiResponse({ status: 201, type: UPost })
    @UseGuards(RolesGuard)
    @Roles('ADMIN', 'CREATOR')
    @Post('/create')
    @UseInterceptors(AnyFilesInterceptor())
    createPost(
        @Headers('authorization') authorization: string,
        @Body() dto: CreatePostDto,
        @UploadedFiles() files?: Array<Express.Multer.File>
    ) {
        return this.postService.createPost(authorization, dto, files)

        // return this.postService.CreateSimpePost(dto)
    }

    @ApiOperation({ summary: 'Получение статей по ID пользователя' })
    @ApiResponse({ status: 201, type: [UPost] })
    @UseGuards(RolesGuard)
    @Get('/getoff/:id')
    GetUserOffers(@Param('id') id: number) {
        return this.postService.GetOffersByUserId(id)
    }

    @ApiOperation({ summary: 'Получение статей по названию подглавы' })
    @ApiResponse({ status: 201, type: [UPost] })
    @UseGuards(RolesGuard)
    @Get('/getoff/sub/:value')
    GetSubchaptersOffers(@Param('value') name: string) {
        return this.postService.getPostBySubChapters(name)
    }

    @ApiOperation({ summary: 'Получение статеьи по ID' })
    @ApiResponse({ status: 201, type: [UPost] })
    @UseGuards(RolesGuard)
    @Get('/:id')
    getPostById(@Param('id') id: number) {
        return this.postService.getPostById(id)
    }
}
