import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@notionhq/client';
import { BlockObjectResponse, PartialBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

@Injectable()
export class NotionService {
    private readonly notion: Client;

    constructor(
        private readonly configService: ConfigService<{ NOTION_AUTH_TOKEN: string; NOTION_DATABASE_ID: string }, true>
    ) {
        this.notion = new Client({
            auth: this.configService.get('NOTION_AUTH_TOKEN'),
        });
    }

    async getDatabase() {
        return await this.notion.databases.query({
            database_id: this.configService.get('NOTION_DATABASE_ID'),
        });
    }

    async getPage(pageId: string) {
        return await this.notion.pages.retrieve({
            page_id: pageId,
        });
    }

    async getBlocks(blockId: string) {
        const blocks: (PartialBlockObjectResponse | BlockObjectResponse)[] = [];
        let cursor: string | undefined;

        while (true) {
            const { results, next_cursor } = await this.notion.blocks.children.list({
                start_cursor: cursor,
                block_id: blockId,
            });
            blocks.push(...results);

            if (!next_cursor) {
                break;
            }
            cursor = next_cursor;
        }

        return blocks;
    }
}
