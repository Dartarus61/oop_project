export class CreateUserDto {
    readonly email: string
    readonly password: string
    readonly id: number
    readonly isActivated: boolean
    readonly name: string
    readonly surname: string
    readonly secondname: string
}
