import { ApiProperty } from '@nestjs/swagger'
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript'
import { UPost } from 'src/models/post.model'

@Table({ tableName: 'Chapter', timestamps:false, freezeTableName:true })
export class Chapter extends Model<Chapter> {
    @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number

    @ApiProperty({ example: 'Java', description: 'Название раздела' })
    @Column({ type: DataType.STRING, allowNull: false })
    name: string

    @Column({ type: DataType.INTEGER, allowNull: true })
    idParent: number

    @Column({ type: DataType.STRING, allowNull: false })
    path: string

    @HasMany(() => UPost)
    posts: UPost[]

    /* @HasMany(() => SubChapt)
    subChapt: SubChapt[] */
}
