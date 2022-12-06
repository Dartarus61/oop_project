import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { LikePost } from 'src/models/likePost.model'
import { setPostLikeDto } from './dto/setPostLike.dto'

@Injectable()
export class likePostService {
    constructor(@InjectModel(LikePost) private readonly likePostRepository: typeof LikePost) {}

    async setLike(data: setPostLikeDto) {
        const like = await this.likePostRepository.findOne({
            where: {
                userId: data.userId,
                postId: data.postId,
            },
        })
        if (like) {
            throw new HttpException('Пользователь может только 1 раз поставить лайк статье', HttpStatus.FORBIDDEN)
        }
        return this.likePostRepository.create({ ...data })
    }

    async deleteLike(data: setPostLikeDto) {
        const like = await this.likePostRepository.findOne({
            where: {
                userId: data.userId,
                postId: data.postId,
            },
        })

        if (!like) {
            throw new HttpException('Пост не существует', HttpStatus.NOT_FOUND)
        }

        await like.destroy()
        return 'Лайк удален'
    }

    async count(postId: number) {
        return (await this.likePostRepository.findAndCountAll({ where: { postId } })).count
    }
}
