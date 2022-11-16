import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { RoleService } from 'src/role/role.service'
import { ChangeRoleDto } from './dto/ChangeRole.dto'
import { CreateUserDto } from './dto/create_user.dto'
import { UpdateUserDto } from './dto/UpdateUser.dto'
import { User } from '../models/user.model'
import { TokenService } from 'src/token/token.service'
import { PostService } from 'src/post/post.service'
import { CommentService } from 'src/comment/comment.service'

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User)
        private userRepository: typeof User,
        private roleService: RoleService,
        private tokenService: TokenService,
        private commentService: CommentService
    ) {}

    async createUser(dto: CreateUserDto) {
        const user = await this.userRepository.create(dto)
        const role = await this.roleService.getRoleByValue('ADMIN')
        await user.$set('roles', [role.id])
        user.roles = [role]
        return user
    }
    async addRole(dto: ChangeRoleDto) {
        const user = await this.userRepository.findByPk(dto.userId)
        const role = await this.roleService.getRoleByValue(dto.value)
        if (role && user) {
            await user.$add('roles', [role.id])
            return user
        }
        throw new HttpException('Пользователь или роль не найдена', HttpStatus.NOT_FOUND)
    }

    async getAll() {
        const users = await this.userRepository.findAll({ include: { all: true } })
        return users
    }

    async updateUser(dto: UpdateUserDto) {
        const user = await this.userRepository.findByPk(dto.id)
        if (user) {
            const log = {
                method: 'update',
                table_name: 'user',
                predto: user.toJSON(),
            }
            //this.backupService.CreateLine(await this.backupService.createDto(log))
            delete dto.id
            await user.update({ ...dto })
            return user
        }
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: { email },
            include: { all: true },
        })
        return user
    }

    async getUserById(id: number) {
        const user = await this.userRepository.findByPk(id)
        if (user) return user
        throw new HttpException('пользователь не найден', HttpStatus.NOT_FOUND)
    }

    async deleteUser(email: string) {
        const user = await this.getUserByEmail(email)
        await this.userRepository.destroy({ where: { id: user.id } })
    }

    async getUserByCode(code: string ) {
        return this.userRepository.findOne({where: {switchKey: code}})
    }

    async activate(value: string) {
        const user = await this.userRepository.findOne({ where: { acticationLink: value } })
        if (user) {
            user.update({ isActivated: true })
            return user
        }
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
    }

    async GetMyProfile(authorization: string) {
        const decoded = await this.tokenService.getDataFromToken(authorization)
        console.log(decoded)
    }
}
