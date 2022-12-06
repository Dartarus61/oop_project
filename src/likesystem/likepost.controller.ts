import { Body, Controller, Get, Post } from '@nestjs/common'
import { setPostLikeDto } from './dto/setPostLike.dto'
import { likePostService } from './likepost.service'

@Controller('likepost')
export class LikePostController {
    constructor(private readonly likePostService: likePostService) {}

    @Post('/set')
    setLike(@Body() likeData: setPostLikeDto) {
        return this.likePostService.setLike(likeData)
    }

    @Post('/delete')
    deleteLike(@Body() likeData: setPostLikeDto) {
        return this.likePostService.deleteLike(likeData)
    }

    @Get('/count')
    getCount(@Body('postId') id: number) {
        return this.likePostService.count(id)
    }
}
