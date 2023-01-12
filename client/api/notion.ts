import { instance } from 'api';
import { AxiosResponse } from 'axios';
import { Database, Page, Block } from 'types/notion';

const prefix = '/notion';

export const getDatabase = async () => {
    try {
        const response = await instance<Database>(`${prefix}/database`);
        return response.data.results;
    } catch (e) {
        const error = e.response as AxiosResponse<Error>;
        throw error.data;
    }
};

export const getPage = async (pageId: string) => {
    try {
        const response = await instance<Page>(`${prefix}/page/${pageId}`);
        return response.data;
    } catch (e) {
        console.log(e);
        const error = e.response as AxiosResponse<Error>;
        throw error.data;
    }
};

export const getBlocks = async (blockId: string) => {
    try {
        const response = await instance<Block[]>(`${prefix}/blocks/${blockId}`);
        return response.data;
    } catch (e) {
        const error = e.response as AxiosResponse<Error>;
        throw error.data;
    }
};

export const getBlock = async (blockId: string) => {
    try {
        const response = await instance<Block>(`${prefix}/blocks/${blockId}`);
        return response.data;
    } catch (e) {
        const error = e.response as AxiosResponse<Error>;
        throw error.data;
    }
};
