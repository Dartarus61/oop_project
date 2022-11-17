import { ApiProperty } from '@nestjs/swagger'
import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    HasOne,
    Model,
    Table,
} from 'sequelize-typescript'
import { Chapter } from 'src/models/chapter.model'
import { Comment } from 'src/models/comment.model'
import { FileFolder } from 'src/models/file.model'
import { User } from 'src/models/user.model'

interface PostCreationAttrs {
    description: string
    title: string
}

@Table({ tableName: 'Post', timestamps:true, freezeTableName:true  })
export class UPost extends Model<UPost, PostCreationAttrs> {
    @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number

    @ApiProperty({ example: 'JavaFX - введение', description: 'Название главы' })
    @Column({ type: DataType.STRING, allowNull: false })
    title: string

    @ApiProperty({ example: 'Что то в ведении про Java', description: 'Содержание статьи' })
    @Column({ type: DataType.STRING(4096), allowNull: true })
    description: string

    @HasMany(() => FileFolder)
    files: FileFolder[]

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number

    @BelongsTo(() => User)
    author: User

    @HasMany(() => Comment)
    comments: Comment[]

    /* @ForeignKey(() => Chapter)
    @Column({ type: DataType.INTEGER })
    subchapterId: number

    @BelongsTo(() => SubChapt)
    subChapt: SubChapt */

    @ForeignKey(() => Chapter)
    @Column({ type: DataType.INTEGER })
    chapterrId: number

    @BelongsTo(() => Chapter)
    chapter: Chapter
}
