import { Module } from '@nestjs/common'
import { BackupService } from './backup.service'
import { BackupController } from './backup.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from 'src/models/user.model'
import { Role } from 'src/models/role.model'
import { UserRoles } from 'src/models/user-roles.model'
import { UPost } from 'src/models/post.model'
import { History } from './backup-history.model'
import { Details } from './backup-details.model'

@Module({
    providers: [BackupService],
    controllers: [BackupController],
    imports: [SequelizeModule.forFeature([User, Role, UserRoles, UPost, History, Details])],
    exports: [BackupService],
})
export class BackupModule {}
