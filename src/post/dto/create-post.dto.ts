import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class CreatePostDto {
    readonly links: string

    readonly title: string

    readonly category: string

    readonly subCategory: string

    readonly text: string
}
