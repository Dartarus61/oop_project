import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'
import { CreateUserDto } from '../user/dto/create_user.dto'
import { ResetPassDto } from './dto/respass.dto'
import * as bcrypt from 'bcrypt'
import { User } from 'src/user/user.model'
import { LoginDto } from './dto/login.dto'
import { TokenService } from 'src/token/token.service'
import { OutputUserDto } from './dto/outputUser.dto'

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private readonly tokenService: TokenService
    ) {}

    async registration(userDto: CreateUserDto) {
        try {
            const candidate = await this.userService.getUserByEmail(userDto.email)
            if (candidate) {
                throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST)
            }
            const hashPassword = await bcrypt.hash(userDto.password, 5)
            const user = await this.userService.createUser({ ...userDto, password: hashPassword })
            return this.generateToken(user)
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY)
        }
    }

    private async generateToken(user: User) {
        try {
            const payload = { email: user.email, id: user.id, roles: user.roles }
            return {
                token: this.jwtService.sign(payload, { secret: process.env.PRIVATE_KEY }),
                user: {
                    id: user.id,
                    email: user.email,
                    isActivated: user.isActivated,
                },
            }
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY)
        }
    }

    private async validateUser(userDto: LoginDto) {
        try {
            const user = await this.userService.getUserByEmail(userDto.email)
            const isPasswordEquals = await bcrypt.compare(userDto.password, user.password)
            if (user && isPasswordEquals) {
                return user
            }
            throw new UnauthorizedException({ message: 'Некорректный емайл или пароль' })
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY)
        }
    }

    async login(userDto: LoginDto) {
        try {
            const user = await this.validateUser(userDto)
            return this.generateToken(user)
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY)
        }
    }

    async reset(dto: ResetPassDto) {
        try {
            const user = await this.userService.getUserByEmail(dto.email)
            if (!user) throw new HttpException('Пользователь с таким емаил не найден', HttpStatus.BAD_REQUEST)

            const isPasswordEquals = await bcrypt.compare(dto.newpass, user.password)
            if (isPasswordEquals) throw new HttpException('Пароли не должны совпадать', HttpStatus.UNAUTHORIZED)
            const NewPass = await bcrypt.hash(dto.newpass, 3)
            await user.update({ password: NewPass })
            return 'Пароль сменен'
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY)
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
}
