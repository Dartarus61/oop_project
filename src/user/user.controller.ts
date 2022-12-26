import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Redirect, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Roles } from 'src/auth/roles-auth.decorator'
import { RolesGuard } from 'src/auth/roles.guard'
import { ChangeRoleDto } from './dto/ChangeRole.dto'
import { CreateUserDto } from './dto/create_user.dto'
import { UpdateUserDto } from './dto/UpdateUser.dto'
import { User } from '../models/user.model'
import { UserService } from './user.service'
import { BanUserDto } from './dto/banUser.dto'
import { retry } from 'rxjs'
import { BanList } from 'src/models/banlist.model'
import { OutputBanListDto } from './dto/outputBanList.dto'
@ApiTags('Пользователи')
@Controller('user')
export class UserController {
    constructor(private UserService: UserService) {}

    @ApiOperation({ summary: 'Создание пользователя' })
    @ApiResponse({ status: 201, type: User })
    @UseGuards(RolesGuard)
    @Roles('USER')
    @Post('/create')
    create(@Body() Dto: CreateUserDto) {
        return this.UserService.createUser(Dto)
    }

    @Get('/activ/:value')
    @Redirect('http://localhost:5000/login')
    async activation(@Param('value') value: string) {
        const fuser = await this.UserService.activate(value)
        return { url: 'http://localhost:5000/myProfile' }
    }

    @ApiOperation({ summary: 'Поиск пользователя по почте' })
    @ApiResponse({ status: 200, type: User })
    @UseGuards(RolesGuard)
    @Roles('USER')
    @Post('/byemail')
    GetUserByEmail(@Body('email') email: string) {
        return this.UserService.getUserByEmail(email)
    }

    @ApiOperation({ summary: 'Выдать роль' })
    @ApiResponse({ status: 200 })
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Post('/addrole')
    ChangeRole(@Body() dto: ChangeRoleDto) {
        return this.UserService.addRole(dto)
    }

    @ApiOperation({ summary: 'Получить всех пользователей' })
    @ApiResponse({ status: 200, type: [User] })
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Get('/all')
    AllPeople() {
        return this.UserService.getAll()
    }

    @Get('/profile')
    userProfile(@Headers('authorization') authorization: string) {
        //if (authorization === undefined) return
        return this.UserService.GetMyProfile(authorization)
    }

    @ApiOperation({ summary: 'Бан пользователя' })
    @ApiResponse({ status: 200, type: BanList })
    @Post('/ban')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    banUser(@Body() banData: BanUserDto) {
        return this.UserService.banUser(banData)
    }

    @ApiOperation({ summary: 'Разбан пользователя' })
    @ApiResponse({ status: 200, type: BanList })
    @Post('/unban')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    unbanUser(@Body('userId') id: number) {
        return this.UserService.removeFromBan(id)
    }

    @ApiOperation({ summary: 'Список забанненных' })
    @ApiResponse({ status: 200, type: OutputBanListDto })
    @Get('/banlist')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    getList() {
        return this.UserService.getBanList()
    }

    @ApiOperation({ summary: 'Удаление роли у пользователя' })
    @Delete('/delrole')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    deleteRole(@Body() roleData: ChangeRoleDto) {
        return this.UserService.removeRole(roleData)
    }
}
