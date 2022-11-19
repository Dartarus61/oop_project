import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNumber, IsString } from 'class-validator'

export class UpdateUserDto {
    @ApiProperty({ example: 5, description: 'ID пользователя' })
    @IsNumber({}, { message: 'Должно быть числом' })
    id: number
    @ApiProperty({ example: 'Bob', description: 'Имя пользователя' })
    @IsString({ message: 'Должно быть строкой' })
    readonly name: string
    @ApiProperty({ example: 'Clemente', description: 'Фамилия пользователя' })
    @IsString({ message: 'Должно быть строкой' })
    readonly surname: string
}
