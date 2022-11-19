import { HttpModule } from '@nestjs/axios'
import { forwardRef, Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuthModule } from 'src/auth/auth.module'
import { MailModule } from 'src/mail/mail.module'
import { UPost } from 'src/models/post.model'
import { Role } from 'src/models/role.model'
import { RoleModule } from 'src/role/role.module'
import { UserRoles } from 'src/models/user-roles.model'
import { UserController } from './user.controller'
import { User } from '../models/user.model'
import { UserService } from './user.service'
import { TokenModule } from 'src/token/token.module'
import { CommentModule } from 'src/comment/comment.module'
import { PostModule } from 'src/post/post.module'

@Module({
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
    imports: [
        SequelizeModule.forFeature([User, Role, UserRoles, UPost]),
        RoleModule,
        MailModule,
        forwardRef(() => AuthModule),
        forwardRef(() => PostModule),
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
        }),
        TokenModule,
        CommentModule,
    ],
})
export class UserModule {}
