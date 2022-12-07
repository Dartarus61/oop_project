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
import { profileUserDto } from './dto/profileUser.dto'
import { Role } from 'src/models/role.model'
import { BanList } from 'src/models/banlist.model'
import { BanUserDto } from './dto/banUser.dto'

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User)
        private userRepository: typeof User,
        @InjectModel(BanList) private banRepository: typeof BanList,
        private roleService: RoleService,
        private tokenService: TokenService,
        private commentService: CommentService,
        @Inject(forwardRef(() => PostService))
        private postService: PostService
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

    async updateUser(dto: UpdateUserDto, user: User) {
        await user.update({ ...dto })
        return user
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: { email },
            include: { all: true },
        })
        return user
    }

    async getUserById(id: number) {
        const user = await this.userRepository.findByPk(id, { include: [Role] })
        if (user) return user
        throw new HttpException('пользователь не найден', HttpStatus.NOT_FOUND)
    }

    async deleteUser(email: string) {
        const user = await this.getUserByEmail(email)
        await this.userRepository.destroy({ where: { id: user.id } })
    }

    async getUserByCode(code: string) {
        return this.userRepository.findOne({ where: { switchKey: code } })
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
        delete decoded.iat
        delete decoded.exp

        let userProfileData = await this.getUserById(decoded.id)

        let userObject = { ...decoded, name: userProfileData.name, surname: userProfileData.surname }
        userObject.roles = userObject.roles.map((el) => {
            return el.value
        })
        userObject.commentCount = await this.commentService.getCountByUserId(decoded.id)
        userObject.postCount = await this.postService.getCountPostByid(decoded.id)
        userObject.posts = await this.postService.GetOffersByUserId(decoded.id)
        console.log({ user: userObject })
        return userObject
    }

    async banUser(banData: BanUserDto) {
        const user = await this.getUserById(banData.userId)

        if (!user) throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)

        const newBanUser = await this.banRepository.create({ ...banData })

        return newBanUser
    }

    async getBanList() {
        const banList = await this.banRepository.findAll({ include: { all: true } })
        banList.map((el) => {
            return { ...el, user: `${el.user.name} ${el.user.surname}` }
        })
    }

    async removeFromBan(userId: number) {
        const unbanned = await this.banRepository.findOne({ where: { userId } })

        if (!unbanned) throw new HttpException('Забаненный пользователь в списке не найден', HttpStatus.NOT_FOUND)

        unbanned.destroy()

        return unbanned
    }

    async removeRole(roleData: ChangeRoleDto) {
        const user = await this.userRepository.findByPk(roleData.userId)
        const role = await this.roleService.getRoleByValue(roleData.value)
        if (role && user) {
            await user.$remove('roles', [role.id])
            return user
        }
        throw new HttpException('Пользователь или роль не найдена', HttpStatus.NOT_FOUND)
    }
}
