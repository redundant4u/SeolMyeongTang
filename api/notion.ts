import { Block, Database, Page } from 'types/notion';
import http from './index';

export const getDatabase = async (): Promise<Database> => {
    return http.get('notion/database');
};

export const getPage = async (id: string): Promise<Page> => {
    return http.get(`notion/page/${id}`);
};

const getBlock = async (id: string): Promise<Block[]> => {
    return http.get(`notion/blocks/${id}`);
};

export const getBlocks = async (id: string): Promise<Block[]> => {
    const blocks = await getBlock(id);
    const childBlocks = await Promise.all(
        blocks
            .filter((block) => block.has_children)
            .map(async (block) => {
                return {
                    id: block.id,
                    children: await getBlock(block.id),
                };
            })
    );
    const blocksWithChildren = blocks.map((block) => {
        const childBlock = childBlocks
            .filter((childBlock) => childBlock.id === block.id)
            .map((childBlock) => childBlock.children)[0];
        block.children = childBlock || null;
        return block;
    });

    return blocksWithChildren;
};
