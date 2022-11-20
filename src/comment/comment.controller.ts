import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Roles } from 'src/auth/roles-auth.decorator'
import { RolesGuard } from 'src/auth/roles.guard'
import { Comment } from '../models/comment.model'
import { CommentService } from './comment.service'
import { SetComment } from './dto/comment.dto'

@ApiTags('Комментарии')
@Controller('comment')
export class CommentController {
    constructor(private commentService: CommentService) {}

    @ApiOperation({ summary: 'Создание статьи' })
    @ApiResponse({ status: 201, type: Comment })
    @UseGuards(RolesGuard)
    @Roles('USER', 'ADMIN', 'CREATOR')
    @Post('/setcom')
    SetComment(@Body() dto: SetComment) {
        return this.commentService.setComment(dto)
    }

    @Get('/:id')
    getCommentByPostId(@Param('id') id: number) {
        return this.commentService.getCommentByPostId(id)
    }
}
