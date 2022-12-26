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
import { CommentService } from 'src/comment/comment.service'
import * as fs from 'fs'
import * as path from 'path'
import { TokenService } from 'src/token/token.service'

@Injectable()
export class PostService {
    uuidCodeRegExp = /\s\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/gm
    constructor(
        @InjectModel(UPost) private postRepository: typeof UPost,
        @InjectModel(User) private userRepository: typeof User,
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        @Inject(forwardRef(() => CommentService))
        private commentService: CommentService,
        private fileService: FilesService,
        private chapterService: ChaptersService,
        private tokenService: TokenService
    ) {}
    //Array<Express.Multer.File>
    async createPost(authorization: string, dto: CreatePostDto, files?: Array<Express.Multer.File>): Promise<object> {
        try {
            const userData = await this.tokenService.getDataFromToken(authorization)
            const user = await this.userService.getUserById(userData.id)
            if (user) {
                const post = await this.postRepository.create({
                    title: dto.title,
                    chapterName: dto.category,
                    subchapterName: dto.subCategory,
                })
                await user.$add('posts', post)
                if (files) {
                    const links = dto.links.split(',')
                    const newFiles = await this.fileService.createFile(dto.text, files, links)
                    post.$add('files', newFiles)
                    return post
                }
                const nameingOfTXT = await this.fileService.createFile(dto.text)
                await post.$add('files', nameingOfTXT)

                return post
            }
            throw new HttpException('не найден пользователь', HttpStatus.NOT_FOUND)
        } catch (error) {
            throw error
        }
    }

    /* async CreateSimpePost(dto: CreatePostDto): Promise<object> {
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
            throw error
        }
    } */

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
            throw error
        }
    }

    async GetOffersByUserId(id: number): Promise<object[]> {
        const posts = await this.postRepository.findAll({ where: { userId: id }, include: { all: true } })
        const tempPosts = JSON.stringify(posts, null, 2)
        const final = JSON.parse(tempPosts)

        const result = await Promise.all(
            final.map(async (el) => {
                delete el.chapter
                delete el.updatedAt
                el.author = `${el.author.name} ${el.author.surname}`
                const commentCount = await this.commentService.getCountByPostId(el.id)
                el.comments = commentCount.count
                for (let i = 0; i < el.files.length; i++) {
                    if (el.files[i].nameOfContent.includes('original.txt')) {
                        el.description = this.fileService
                            .GetDataByFilesData(el.files[i])
                            .split(this.uuidCodeRegExp)
                            .join('')
                            .split('\n')
                            .join('')
                            .split(' ')
                        if (el.description.length <= 15) el.description = el.description.join(' ')
                        else {
                            let tempOutputDescription = ''
                            for (let index = 0; index < 15; index++) {
                                tempOutputDescription += el.description[index] + ' '
                            }
                            el.description = tempOutputDescription
                        }
                        break
                    }
                }
                delete el.files
                return el
            })
        )

        return result
    }

    async getPostById(id: number) {
        const posts = await this.postRepository.findByPk(id, { include: { all: true } })
        const tempPosts = JSON.stringify(posts, null, 2)
        const final = JSON.parse(tempPosts)
        for (let i = 0; i < final.files.length; i++) {
            if (!final.files[i].nameOfContent.includes('original') && final.files[i].nameOfContent.includes('.txt')) {
                const data = this.fileService.GetDataByFilesData(final.files[i])

                return { title: posts.title, data: data.toString() }
            }
        }
    }

    async getPostBySubChapters(name: string) {
        const posts = await this.postRepository.findAll({ where: { subchapterName: name }, include: { all: true } })
        const tempPosts = JSON.stringify(posts, null, 2)
        const final = JSON.parse(tempPosts)

        const result = await Promise.all(
            final.map(async (el) => {
                delete el.chapter
                delete el.updatedAt
                el.author = `${el.author.name} ${el.author.surname}`
                const commentCount = await this.commentService.getCountByPostId(el.id)
                el.comments = commentCount.count
                for (let i = 0; i < el.files.length; i++) {
                    if (el.files[i].nameOfContent.includes('original.txt')) {
                        el.description = this.fileService.GetDataByFilesData(el.files[i])

                        el.description = el.description
                            .split(this.uuidCodeRegExp)
                            .join('')
                            .split('\n')
                            .join('')
                            .split(' ')
                        if (el.description.length <= 15) el.description = el.description.join(' ')
                        else {
                            let tempOutputDescription = ''
                            for (let index = 0; index < 15; index++) {
                                tempOutputDescription += el.description[index] + ' '
                            }
                            el.description = tempOutputDescription
                        }
                        break
                    }
                }
                delete el.files
                return el
            })
        )

        return result
    }

    async getCountPostByid(id: number) {
        const count = await this.postRepository.findAndCountAll({ where: { userId: id } })
        return count.count
    }
}
