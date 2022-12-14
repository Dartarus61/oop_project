import { ApiProperty } from '@nestjs/swagger'
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript'
import { User } from './user.model'

@Table({ tableName: 'BanList', timestamps: true, freezeTableName: true })
export class BanList extends Model<BanList> {
    @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number

    @ApiProperty({ example: 'Оскорбление пользователей', description: 'Причина бана' })
    @Column({ type: DataType.STRING, allowNull: false })
    banReason: string

    @ApiProperty({ example: 5, description: 'ID забаненного пользователя' })
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number

    @BelongsTo(() => User)
    user: User
}
