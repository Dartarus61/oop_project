import { ApiProperty } from '@nestjs/swagger'
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript'
import { UPost } from 'src/models/post.model'
import { User } from 'src/models/user.model'

interface PostCreationAttrs {
    description: string
    economic: string
    area_of_improvement: string
    filePath: string
}

@Table({ tableName: 'Comment', timestamps: true, freezeTableName: true })
export class Comment extends Model<Comment> {
    @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number

    @ApiProperty({ example: 'Автор хорош, давай дальше!', description: 'Содержание комментария' })
    @Column({ type: DataType.STRING, allowNull: false })
    description: string

    @ApiProperty({ example: 5, description: 'ID пользователя, который написал комментарий' })
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number

    @BelongsTo(() => User)
    user: User

    @ForeignKey(() => UPost)
    @Column({ type: DataType.INTEGER })
    postId: number

    @BelongsTo(() => UPost)
    post: UPost
}
