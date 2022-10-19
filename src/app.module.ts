import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { ServeStaticModule } from '@nestjs/serve-static'
import { User } from './user/user.model'
import { PostModule } from './post/post.module'
import * as path from 'path'
import { UPost } from './post/post.model'
import { RoleModule } from './role/role.module'
import { Role } from './role/role.model'
import { UserRoles } from './role/user-roles.model'
import { FilesModule } from './files/files.module'
import { CommentModule } from './comment/comment.module'
import { Comment } from './comment/comment.model'
import { BackupModule } from './backup/backup.module'
import { History } from './backup/backup-history.model'
import { Details } from './backup/backup-details.model'
import { ChaptersModule } from './chapters/chapters.module'
import { Chapter } from './chapters/chapter.model'
import { FileFolder } from './files/file.model'
import { MailerModule } from '@nestjs-modules/mailer'
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'

@Module({
    imports: [
        MailerModule.forRoot({
            transport: 'smtps://project.oop@mail.ru:PFw6RrKEef2J8jkWdfHs@smtp.mail.ru',
            defaults: {
                from: '"no reply" <project.oop@mail.ru>',
            },
            template: {
                dir: __dirname + '/templates',
                adapter: new EjsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
        ConfigModule.forRoot({
            envFilePath: `.env`,
            isGlobal: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, 'static'),
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'postgres',
            database: 'tryoop',
            models: [User, UPost, Role, UserRoles, Comment, History, Details, Chapter, FileFolder],
            autoLoadModels: true,
            sync: { force: true },
            /* dialectOptions:{
                ssl:{
                    require: true,
                    rejectUnauthorized: false,
                }
            } */
        }),
        UserModule,
        AuthModule,
        PostModule,
        RoleModule,
        FilesModule,
        CommentModule,
        BackupModule,
        ChaptersModule,
    ],
})
export class AppModule {}
