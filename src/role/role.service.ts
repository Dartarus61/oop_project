import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CreateRoleDto } from './dto/create-role.dto'
import { Role } from '../models/role.model'

@Injectable()
export class RoleService {
    constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

    async getRoleByValue(value: string) {
        const role = await this.roleRepository.findOne({ where: { value } })
        return role
    }
    async createRole(dto: CreateRoleDto) {
        const role = await this.roleRepository.create(dto)
        return role
    }
}
