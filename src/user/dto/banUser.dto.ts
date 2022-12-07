import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class BanUserDto {
    @ApiProperty({ example: 5, description: 'ID пользователя' })
    @IsNumber({}, { message: 'Должно быть числом' })
    readonly userId: number
    @ApiProperty({ example: 'Оскорбление пользователей', description: 'Причина бана' })
    @IsString({ message: 'Должно быть строкой' })
    readonly banReason: string
}
