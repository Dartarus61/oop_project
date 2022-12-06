import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { LikeComment } from 'src/models/likeComments.model'
import { LikePost } from 'src/models/likePost.model'
import { setCommentLikeDto } from './dto/setCommentLike.dto'

@Injectable()
export class likeComService {
    constructor(@InjectModel(LikeComment) private readonly likeCommentRepository: typeof LikeComment) {}

    async setLike(data: setCommentLikeDto) {
        const like = await this.likeCommentRepository.findOne({
            where: {
                userId: data.userId,
                commentId: data.commentId,
            },
        })
        if (like) {
            throw new HttpException('Пользователь может только 1 раз поставить лайк статье', HttpStatus.FORBIDDEN)
        }
        return this.likeCommentRepository.create({ ...data })
    }

    async deleteLike(data: setCommentLikeDto) {
        const like = await this.likeCommentRepository.findOne({
            where: {
                userId: data.userId,
                commentId: data.commentId,
            },
        })

        if (!like) {
            throw new HttpException('Пост не существует', HttpStatus.NOT_FOUND)
        }

        await like.destroy()
        return 'Лайк удален'
    }

    async count(commentId: number) {
        return (await this.likeCommentRepository.findAndCountAll({ where: { commentId } })).count
    }
}
