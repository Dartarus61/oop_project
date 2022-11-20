import { Module } from '@nestjs/common'
import { SendfileController } from './sendfile.controller'

@Module({
    controllers: [SendfileController],
    providers: [],
})
export class SendfileModule {}
