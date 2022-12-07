import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import sequelize, { Op } from 'sequelize'
import { Chapter } from '../models/chapter.model'
import { CreateChapterDto } from './dto/CreateChapter.dto'

@Injectable()
export class ChaptersService {
    constructor(@InjectModel(Chapter) private ChapterRepository: typeof Chapter) {}

    async CreateChapter(dto: CreateChapterDto) {
        try {
            if (dto.idParent == null) {
                const chapter = await this.ChapterRepository.create({ ...dto, path: `${dto.name}.` })
                return chapter
            }
            const parent = await this.ChapterRepository.findByPk(dto.idParent)
            if (parent) {
                const path = parent.path + dto.name + '.'
                const chapter = await this.ChapterRepository.create({ ...dto, path })
                return chapter
            }
            throw new HttpException('Родитель не найден', HttpStatus.NOT_FOUND)
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY)
        }
    }

    async GetAllChapters() {
        const chapters = await this.ChapterRepository.findAll({ where: { idParent: null } })
        return chapters.map((el) => {
            return el.name
        })
    }

    async GetSubChapterByChapterName(name: string) {
        const subchapters = await this.ChapterRepository.findAll({
            where: {
                path: {
                    [Op.startsWith]: `${name}.`,
                },
            },
        })
        return subchapters.map((el) => {
            return el.name
        })
    }

    async GetChupterByName(name: string) {
        try {
            const chupter = await this.ChapterRepository.findOne({ where: { name } })
            if (chupter) {
                return chupter
            }
            throw new HttpException('Раздел не найден', HttpStatus.NOT_FOUND)
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY)
        }
    }

    async GetSubByName(name: string) {
        try {
            const subchupter = await this.ChapterRepository.findOne({ where: { name } })
            if (subchupter) {
                return subchupter
            }
            throw new HttpException('Подраздел не найден', HttpStatus.NOT_FOUND)
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY)
        }
    }

    async GetMenu() {
        try {
            const main = await this.ChapterRepository.findAll({ where: { idParent: null } })
            let subchapts = []
            const direction = []
            let childs = []
            for (let i = 0; i < main.length; i++) {
                const temp = JSON.stringify(main[i], null, 2)
                direction.push(JSON.parse(temp))
                delete direction[i].path
                delete direction[i].idParent
                subchapts = await this.ChapterRepository.findAll({ where: { idParent: main[i].id } })
                subchapts.forEach((el) => {
                    childs.push(el.name)
                })
                direction[i].childs = childs
                childs = []
            }

            return direction
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY)
        }
    }

    async deleteChapter(name: string) {
        const chapter = await this.ChapterRepository.findOne({ where: { name } })

        if (!chapter) throw new HttpException('Глава или подглава не найдена', HttpStatus.NOT_FOUND)

        await chapter.destroy()

        return chapter
    }
}
