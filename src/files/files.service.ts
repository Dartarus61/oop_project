import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import * as path from 'path'
import * as uuid from 'uuid'
import * as fs from 'fs'
import { InjectModel } from '@nestjs/sequelize'
import { FileFolder } from '../models/file.model'

@Injectable()
export class FilesService {
    constructor(@InjectModel(FileFolder) private fileRepository: typeof FileFolder) {}

    async createFile(text?: string, file?: Array<Express.Multer.File>): Promise<FileFolder[]> {
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
                    fileName = uuid.v4() + '.jpg'

                    fs.writeFileSync(path.join(filePath, fileName), file[index].buffer)
                    masReturn.push(fileName)
                }
            }
            const fileNameTxt = uuid.v4() + '.txt'
            fs.writeFileSync(path.join(filePath, fileNameTxt), text)
            masReturn.push(fileNameTxt)
            return await this.GenerateFileDB(masReturn)
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
        if (fileData.nameOfContent.split('.')[1] === 'txt') {
            let data = fs.readFileSync(path.resolve(fileData.contentPath, fileData.nameOfContent)).toString('utf-8')
            return data
        } else {
            let data = fs.readFileSync(path.resolve(fileData.contentPath, fileData.nameOfContent))
            return data
        }
    }
}
