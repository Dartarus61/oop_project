import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Comment } from './comment.model'
import { User } from './user.model'

@Table({ tableName: 'LikeComment', timestamps: true, freezeTableName: true })
export class LikeComment extends Model<LikeComment> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number

    @ForeignKey(() => Comment)
    @Column({ type: DataType.INTEGER })
    commentId: number

    @BelongsTo(() => Comment)
    comment: Comment

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number

    @BelongsTo(() => User)
    user: User
}
