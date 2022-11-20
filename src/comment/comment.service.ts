import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Comment } from 'src/models/comment.model'
import { UPost } from 'src/models/post.model'
import { SetComment } from './dto/comment.dto'

@Injectable()
export class CommentService {
    constructor(
        @InjectModel(UPost) private postRepository: typeof UPost,
        @InjectModel(Comment) private commentRepository: typeof Comment
    ) {}

    async setComment(dto: SetComment) {
        const post = await this.postRepository.findOne({ where: { id: dto.postId } })
        const NewComment = await this.commentRepository.create({ description: dto.ctx, userId: dto.userId })
        await post.$add('comments', NewComment)
        return NewComment
    }

    async getCountByUserId(id: number) {
        return (await this.commentRepository.findAndCountAll({ where: { userId: id } })).count
    }

    async getCountByPostId(id: number) {
        return this.commentRepository.findAndCountAll({ where: { postId: id } })
    }

    async getCommentByPostId(id: number) {
        return this.commentRepository.findAll({ where: { postId: id } })
    }
}
