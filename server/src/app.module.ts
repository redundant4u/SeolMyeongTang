import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { NotionModule } from './notion/notion.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env'],
            validationSchema: Joi.object({
                NOTION_AUTH_TOKEN: Joi.string().required(),
                NOTION_DATABASE_ID: Joi.string().required(),
            }),
        }),
        NotionModule,
    ],
})
export class AppModule {}
