import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { FileFolder } from '../models/file.model'
import { FilesService } from './files.service'

@Module({
    providers: [FilesService],
    imports: [SequelizeModule.forFeature([FileFolder])],
    exports: [FilesService],
})
export class FilesModule {}
