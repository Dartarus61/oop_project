import { HttpException, Injectable, HttpStatus, Inject, forwardRef } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { Chapter } from 'src/models/chapter.model'
import { ChaptersService } from 'src/chapters/chapters.service'
import { Comment } from 'src/models/comment.model'
import { FileFolder } from 'src/models/file.model'
import { FilesService } from 'src/files/files.service'
import { User } from 'src/models/user.model'
import { UserService } from 'src/user/user.service'
import { CreatePostDto } from './dto/create-post.dto'
import { GetGroupOffers } from './dto/getGroupOffers.dto'
import { UPost } from '../models/post.model'

@Injectable()
export class PostService {
    constructor(
        @InjectModel(UPost) private postRepository: typeof UPost,
        @InjectModel(User) private userRepository: typeof User,
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        private fileService: FilesService,
        private chapterService: ChaptersService
    ) {}
    //Array<Express.Multer.File>
    async createPost(dto: CreatePostDto, files?: Array<Express.Multer.File>): Promise<object> {
        try {
            const user = await this.userService.getUserById(dto.userId)
        if (user) {
            const post = await this.postRepository.create({ title: dto.title })
            await user.$add('posts', post)
            const chapt = await this.chapterService.GetChupterByName(dto.chapter)
            const sub = await this.chapterService.GetSubByName(dto.subsection)
            await chapt.$add('posts', post)
            await sub.$add('posts', post)
            if (files) {
                const newFiles = await this.fileService.createFile(dto.description, files)
                post.$add('files', newFiles)
                return post
            }
            const nameingOfTXT = await this.fileService.createFile(dto.description)
            await post.$add('files', nameingOfTXT)
            return post
        }
        throw new HttpException('не найден пользователь', HttpStatus.NOT_FOUND)
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY)
        }
        
    }

    async CreateSimpePost(dto: CreatePostDto): Promise<object> {
        try {
            const user = await this.userService.getUserById(dto.userId)
        if (user) {
            const post = await this.postRepository.create({ title: dto.title, description: dto.description })
            await user.$add('posts', post)
            const chapt = await this.chapterService.GetChupterByName(dto.chapter)
            const sub = await this.chapterService.GetSubByName(dto.subsection)
            await chapt.$add('posts', post)
            await sub.$add('posts', post)
            return post
        }
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY)
        }
        
    }

    async Offerconstruct(posts) {
        try {
           const massOfPosts = []
        for (let index = 0; index < posts.length; index++) {
            const ParseOffer = JSON.stringify(posts[index], null, 2)
            massOfPosts.push(JSON.parse(ParseOffer))

            const user = await this.userService.getUserById(posts[index].userId)

            massOfPosts[index].Author = `${user.name} ${user.surname}`
            if (!massOfPosts[index].Comments) continue

            for (let j = 0; j < massOfPosts[index].Comments.length; j++) {
                const boss = await this.userRepository.findOne({
                    where: { id: massOfPosts[index].Comments[j].userId },
                    raw: true,
                })

                massOfPosts[index].Comments[j].Name = `${boss.name} ${boss.surname}`
            }
        }

        massOfPosts.sort((a, b) => a.id - b.id)
        return massOfPosts 
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY)
        }
        
    }

    async GetOffersByUserId(id: number): Promise<object[]> {
        try {
        const user = await this.postRepository.findAll({ where: { userId: id }, include: [{ all: true }] })

        if (!user) throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
        const myoffers = []
        console.log(user)

        for (let index = 0; index < user.length; index++) {
            const parsejson = JSON.stringify(user[index], null, 2)
            myoffers.push(JSON.parse(parsejson))

            if (!myoffers[index].Comments) continue

            for (let j = 0; j < myoffers[index].Comments.length; j++) {
                const boss = await this.userRepository.findOne({
                    where: { id: myoffers[index].Comments[j].userId },
                    raw: true,
                })

                myoffers[index].Comments[j].Name = boss.name + ' ' + boss.surname
            }
        }
        myoffers.sort((a, b) => a.id - b.id)
        return myoffers    
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY)
        }
        
    }

    async GetGroupOffersByModule(chapter: string): Promise<object[]> {
        try {
           const chapt = await this.chapterService.GetChupterByName(chapter)
        if (!chapt) throw new HttpException('Обучающий модуль не найден', HttpStatus.NOT_FOUND)
        const allposts = await this.postRepository.findAll()
        const postWithComments = await this.Offerconstruct(allposts)
        return postWithComments 
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY)
        }
        
    }

    async getPostBySubChapters(id: number) {
        try {
           const posts = await this.postRepository.findAll({ where: { chapterrId: id } })
        return posts 
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY)
        }
        
    }

    async getCountPostByid(id: number) {
        return (await this.postRepository.findAndCountAll({where:{userId:id}})).count
        
    }
}
