export class profileUserDto {
    readonly email: string
    readonly id: number
    readonly roles: string[]
    readonly name: string
    readonly surname: string
    
    constructor(model) {
        this.email = model.email
        this.id = model.id
        this.roles = model.roles
        this.name = model.name
        this.surname = model.surname
    }
}