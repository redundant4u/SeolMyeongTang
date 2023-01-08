import { Controller, Get, Param } from '@nestjs/common';
import { NotionService } from './notion.service';

@Controller('notion')
export class NotionController {
    constructor(private readonly notionService: NotionService) {}

    @Get('database')
    async getDatabase() {
        return await this.notionService.getDatabase();
    }

    @Get('page/:pageId')
    async getPage(@Param('pageId') pageId: string) {
        return await this.notionService.getPage(pageId);
    }

    @Get('blocks/:blockId')
    async getBlocks(@Param('blockId') blockId: string) {
        return await this.notionService.getBlocks(blockId);
    }
}
