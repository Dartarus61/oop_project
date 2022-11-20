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

@Table({ tableName: 'Post', timestamps: true, freezeTableName: true })
export class UPost extends Model<UPost> {
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

    @Column({ type: DataType.STRING, allowNull: false })
    chapterName: string

    @Column({ type: DataType.STRING, allowNull: false })
    subchapterName: string
}
