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
import { SubChapt } from './chapters/subchapters.model'
import { FileFolder } from './files/file.model'

@Module({
    imports: [
        UserModule,
        AuthModule,
        ConfigModule.forRoot({
            envFilePath: `.env`,
        }),
        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, 'static'),
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.DB_HOST ||'localhost',
            port: 5432,
            username:process.env.DB_USER||  'postgres',
            password:process.env.DB_PASSWORD || 'postgres',
            database:process.env.DB_NAME || 'tryoop',
            models: [User, UPost, Role, UserRoles, Comment, History, Details, Chapter, SubChapt, FileFolder],
            autoLoadModels: true,
            sync: { alter: true },
            ssl:true
        }),
        PostModule,
        RoleModule,
        FilesModule,
        CommentModule,
        BackupModule,
        ChaptersModule,
    ],
})
export class AppModule {}
