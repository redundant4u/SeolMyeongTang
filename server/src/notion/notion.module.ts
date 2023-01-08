import { Module } from '@nestjs/common';
import { NotionController } from './notion.controller';
import { NotionService } from './notion.service';

@Module({
    imports: [],
    controllers: [NotionController],
    providers: [NotionService],
})
export class NotionModule {}
