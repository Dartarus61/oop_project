import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import * as path from 'path'
import * as uuid from 'uuid'
import * as fs from 'fs'
import { InjectModel } from '@nestjs/sequelize'
import { FileFolder } from '../models/file.model'

@Injectable()
export class FilesService {
    constructor(@InjectModel(FileFolder) private fileRepository: typeof FileFolder) {}

    async createFile(text?: string, file?: Array<Express.Multer.File>, links?: string[]): Promise<FileFolder[]> {
        try {
            const masReturn: any[] = []
            const filePath = path.resolve(__dirname, '..', 'static')
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true })
            }
            masReturn.push(filePath)
            if (file) {
                let fileName = ''
                for (let index = 0; index < file.length; index++) {
                    fileName = links[index] + '.jpg'
                    fs.writeFileSync(path.join(filePath, fileName), file[index].buffer)
                    masReturn.push(fileName)
                }
            }
            let textOfPost = text
            for (let i = 0; i < links.length; i++) {
                textOfPost = textOfPost.replace(
                    links[i],
                    `</div><img src="${process.env.URL_FOR_IMG}${links[i]}"/><div>`
                )
            }

            const textInArr = textOfPost.split('\n')
            let strdata = ''
            for (let i = 0; i < textInArr.length; i++) {
                strdata += `<div>${textInArr[i]}</div>`
            }
            strdata = `<div> ${strdata} </div>`
            console.log(strdata)

            const fileName = uuid.v4()
            const fileNameForOriginal = fileName + ' original.txt'
            fs.writeFileSync(path.join(filePath, fileName + '.txt'), strdata)
            fs.writeFileSync(path.join(filePath, fileNameForOriginal), text)
            masReturn.push(fileName + '.txt', fileNameForOriginal)
            return this.GenerateFileDB(masReturn)
        } catch (e) {
            console.log(e)

            throw new HttpException('Произошла ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async GenerateFileDB(FileDataArr: string[]): Promise<FileFolder[]> {
        const ArrOfObjectByFiles: FileFolder[] = []
        let file: FileFolder
        for (let index = 1; index < FileDataArr.length; index++) {
            file = await this.fileRepository.create({ contentPath: FileDataArr[0], nameOfContent: FileDataArr[index] })
            ArrOfObjectByFiles.push(file)
        }
        return ArrOfObjectByFiles
    }

    GetDataByFilesData(fileData) {
        let data = fs.readFileSync(path.resolve(fileData.contentPath, fileData.nameOfContent)).toString('utf-8')
        return data
    }
}
