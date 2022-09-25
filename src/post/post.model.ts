import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from 'sequelize-typescript'
import { Chapter } from 'src/chapters/chapter.model'
import { SubChapt } from 'src/chapters/subchapters.model'
import { Comment } from 'src/comment/comment.model'
import { FileFolder } from 'src/files/file.model'
import { User } from 'src/user/user.model'

interface PostCreationAttrs {
    description: string
    title: string
}

@Table({ tableName: 'posts' })
export class Post extends Model<Post, PostCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number

    @Column({ type: DataType.STRING, allowNull: false })
    title: string

    @Column({type:DataType.STRING(4096),allowNull:true})
    description:string

    @HasMany(() => FileFolder)
    files: FileFolder[]

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number

    @BelongsTo(() => User)
    author: User

    @HasMany(() => Comment)
    comments: Comment[]

    @ForeignKey(()=>SubChapt)
    @Column({type:DataType.INTEGER})
    subchapterId: number

    @BelongsTo(()=>SubChapt)
    subChapt:SubChapt


    @ForeignKey(()=>Chapter)
    @Column({type:DataType.INTEGER})
    chapterrId: number

    @BelongsTo(()=>Chapter)
    chapter:Chapter
}
