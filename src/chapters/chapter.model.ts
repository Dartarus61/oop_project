import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript'
import { Post } from 'src/post/post.model'
import { SubChapt } from './subchapters.model'

@Table({ tableName: 'chapter' })
export class Chapter extends Model<Chapter> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number

    @Column({ type: DataType.STRING, allowNull: false })
    name: string

    @HasMany(()=>Post)
    posts:Post[]

    @HasMany(()=>SubChapt)
    subChapt:SubChapt[]

}