import { Body, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express'
import { Roles } from 'src/auth/roles-auth.decorator'
import { CreatePostDto } from './dto/create-post.dto'
import { GetGroupOffers } from './dto/getGroupOffers.dto'
import { PostService } from './post.service'

@Controller('post')
export class PostController {
    constructor(private postService: PostService) {}

    @Roles('USER','ADMIN')
    @Post('/create')
    @UseInterceptors(AnyFilesInterceptor())
    createPost(@Body() dto: CreatePostDto, @UploadedFiles() files?: Array<Express.Multer.File>) {
        console.log(files);
        
        return this.postService.createPost(dto, files)

       // return this.postService.CreateSimpePost(dto)
    }

    @Roles('USER','ADMIN')
    @Post('/getoff')
    GetOffers(@Body('id') id: number) {
        return this.postService.GetOffersByUserId(id)
    }

    @Roles('USER','ADMIN')
    @Post('/getgroup')
    GetGroupOffers(@Body() dto: GetGroupOffers) {
        return this.postService.GetGroupOffersByModule(dto)
    }
}
