import { Body, Controller, Post } from '@nestjs/common'
import { Roles } from 'src/auth/roles-auth.decorator'
import { CommentService } from './comment.service'
import { SetComment } from './dto/comment.dto'

@Controller('comment')
export class CommentController {
    constructor(private commentService: CommentService) {}

    @Roles('USER','ADMIN')
    @Post('/setcom')
    SetComment(@Body() dto: SetComment) {
        return this.commentService.setComment(dto)
    }

}
