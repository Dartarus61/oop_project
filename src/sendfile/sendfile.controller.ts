import { Controller, Get, Param, Post, Res } from '@nestjs/common'
import { Response } from 'express'
import * as fs from 'fs'
import * as path from 'path'

@Controller('sendfile')
export class SendfileController {
    @Get('/img/:fileName')
    getPicture(@Param('fileName') fileName: string, @Res() res: Response) {
        console.log(path.resolve(__dirname, '../static/', fileName))

        return res.sendFile(path.resolve(__dirname, '../static/', fileName + '.jpg'))
    }
}
