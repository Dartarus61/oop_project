import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import sequelize, { Op } from 'sequelize'
import { Chapter } from './chapter.model'
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
            throw new HttpException(error,HttpStatus.BAD_GATEWAY)
        }
        
    }

    async GetChupterByName(name: string) {
        try {
            const chupter = await this.ChapterRepository.findOne({ where: { name } })
        if (chupter) {
            return chupter
        }
        throw new HttpException('Раздел не найден', HttpStatus.NOT_FOUND)
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_GATEWAY)
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
            throw new HttpException(error,HttpStatus.BAD_GATEWAY)
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
                subchapts = await this.ChapterRepository.findAll({
                    where: {
                        path: {
                            [Op.startsWith]: `${main[i].name}.`,
                        },
                    },
                })
                subchapts.map((el) => {
                    el = JSON.stringify(el, null, 2)
                    el = JSON.parse(el)
                    const temp = el.path.split('.')
                    if (temp[1] !== null && el.name == temp[1] && temp.length == 3) childs.push(el)
                })
                direction[i].childs = childs
                childs = []
        }

        return direction
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_GATEWAY)
        }
        
    }
}
//TODO: запрос подраздела - выдача всех статей по этому подразделу
