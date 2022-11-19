import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'
import { CreateUserDto } from '../user/dto/create_user.dto'
import { SwitchPassDto } from './dto/switchPass.dto'
import * as bcrypt from 'bcrypt'
import { User } from 'src/models/user.model'
import { LoginDto } from './dto/login.dto'
import { TokenService } from 'src/token/token.service'
import { OutputUserDto } from './dto/outputUser.dto'
import { MailService } from 'src/mail/mail.service'
import * as uuid from 'uuid'
import { newPassDto } from './dto/newPass.dto'
import { UpdateUserDto } from 'src/user/dto/UpdateUser.dto'

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private readonly tokenService: TokenService,
        private mailService: MailService
    ) {}

    async registration(userDto: CreateUserDto) {
        const candidate = await this.userService.getUserByEmail(userDto.email)
        if (candidate) {
            throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5)
        const acticationLink = uuid.v4()
        const user = await this.userService.createUser({ ...userDto, password: hashPassword, acticationLink })

        this.mailService.sendActivation(user.email, user.acticationLink)

        return this.generateToken(user)
    }

    private async generateToken(user: User) {
        const payload = { email: user.email, id: user.id, roles: user.roles, name: user.name, surname: user.surname }
        return {
            token: this.jwtService.sign(payload, { secret: process.env.PRIVATE_KEY }),
            user: {
                id: user.id,
                email: user.email,
                isActivated: user.isActivated,
                roles: user.roles,
            },
        }
    }

    private async validateUser(userDto: LoginDto) {
        const user = await this.userService.getUserByEmail(userDto.email)
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        const isPasswordEquals = await bcrypt.compare(userDto.password, user.password)
        if (user && isPasswordEquals) {
            return user
        }
        throw new UnauthorizedException({ message: 'Некорректный емайл или пароль' })
    }

    async login(userDto: LoginDto) {
        const user = await this.validateUser(userDto)
        return this.generateToken(user)
    }

    async switchPass(dto: SwitchPassDto) {
        const user = await this.userService.getUserById(dto.id)

        const isPassEquils = await bcrypt.compare(dto.password, user.password)

        if (!isPassEquils) {
            throw new HttpException('Неверный старый пароль', HttpStatus.BAD_REQUEST)
        }

        const isNewPassEquils = await bcrypt.compare(dto.newPassword, user.password)

        if (isNewPassEquils) {
            throw new HttpException('Новый пароль не может совпадать со старым', HttpStatus.BAD_REQUEST)
        }

        const hashPassword = await bcrypt.hash(dto.newPassword, 3)
        await user.update({ password: hashPassword })

        const userDto = new OutputUserDto(user)
        const tokens = await this.generateToken(user)

        return {
            ...tokens,
        }
    }

    async forgotPass(email: string) {
        const user = await this.userService.getUserByEmail(email)
        if (!user) throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
        const key = `f${(~~(Math.random() * 1e8)).toString(16)}`
        await user.update({ switchKey: key })
        await this.mailService.sendSwitchPasswordCodeMail(email, key)

        return
    }

    async newPass(dto: newPassDto) {
        const user = await this.userService.getUserByCode(dto.code)
        if (!user) throw new HttpException('Неверный код', HttpStatus.NOT_FOUND)

        user.switchKey = null
        const hashPassword = await bcrypt.hash(dto.newPass, 3)

        await user.update({ password: hashPassword, switchKey: null })

        const userDto = new OutputUserDto(user)
        const tokens = await this.generateToken(user)

        return {
            ...tokens,
            user: userDto,
        }
    }

    async refresh(authorization: string) {
        try {
            const decoded = await this.tokenService.getDataFromToken(authorization)

            const user = await this.userService.getUserById(decoded.id)
            if (user.isActivated != decoded.isActivated) {
                decoded.isActivated = user.isActivated
            }

            return {
                token: authorization.split(' ')[1],
                user: {
                    ...new OutputUserDto(decoded),
                },
            }
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY)
        }
    }

    async updateUser(dto: UpdateUserDto) {
        const user = await this.userService.getUserById(dto.id)
        if (user) {
            delete dto.id
            const newData = await this.userService.updateUser(dto, user)
            return this.generateToken(newData)
        }
    }
}
