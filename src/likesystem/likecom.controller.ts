import { Body, Controller, Get, Post } from '@nestjs/common'
import { setCommentLikeDto } from './dto/setCommentLike.dto'
import { likeComService } from './likecom.service'

@Controller('likecom')
export class LikeComController {
    constructor(private readonly likeCommentService: likeComService) {}

    @Post('/set')
    setLike(@Body() likeData: setCommentLikeDto) {
        return this.likeCommentService.setLike(likeData)
    }

    @Post('/delete')
    deleteLike(@Body() likeData: setCommentLikeDto) {
        return this.likeCommentService.deleteLike(likeData)
    }

    @Get('/count')
    getCount(@Body('postId') id: number) {
        return this.likeCommentService.count(id)
    }
}
