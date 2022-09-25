import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from 'sequelize-typescript'
import { Post } from 'src/post/post.model'
import { Chapter } from './chapter.model'

@Table({ tableName: 'subchapt' })
export class SubChapt extends Model<SubChapt> {
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

    @ForeignKey(()=>Chapter)
    @Column({type:DataType.INTEGER,allowNull:false})
    chapterId:number

    @BelongsTo(()=>Chapter)
    chapter:Chapter
 

}
