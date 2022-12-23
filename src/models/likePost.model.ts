import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { UPost } from './post.model'
import { User } from './user.model'

@Table({ tableName: 'LikePost', timestamps: true, freezeTableName: true })
export class LikePost extends Model<LikePost> {
    @ForeignKey(() => UPost)
    @Column({ type: DataType.INTEGER, primaryKey: true })
    postId: number

    @BelongsTo(() => UPost)
    post: UPost

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, primaryKey: true })
    userId: number

    @BelongsTo(() => User)
    user: User
}
