import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { userInfo } from 'os'
import { Comment } from 'src/models/comment.model'
import { UPost } from 'src/models/post.model'
import { User } from 'src/models/user.model'
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
        const comments = await this.commentRepository.findAll({ where: { postId: id }, include: [User] })
        return comments.map((el) => {
            return { name: `${el.user.name} ${el.user.surname}`, createdAt: el.createdAt, text: el.description }
        })
    }
}
