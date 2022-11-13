import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript'
import { UPost } from 'src/models/post.model'

@Table({ tableName: 'File', timestamps:false, freezeTableName:true  })
export class FileFolder extends Model<FileFolder> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number

    @Column({ type: DataType.STRING, allowNull: false })
    contentPath: string

    @Column({ type: DataType.STRING, allowNull: false })
    nameOfContent: string

    @ForeignKey(() => UPost)
    @Column({ type: DataType.INTEGER })
    postId: number

    @BelongsTo(() => UPost)
    post: UPost
}
