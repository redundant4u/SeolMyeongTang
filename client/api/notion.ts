import { instance } from 'api';
import { AxiosResponse } from 'axios';
import { GetDatabaseResponse, GetPageResponse, GetBlocksResponse } from 'types/notion';

const prefix = '/notion';

export const getDatabase = async () => {
    try {
        const response = await instance<GetDatabaseResponse>(`${prefix}/database`);
        return response.data.results;
    } catch (e) {
        const error = e.response as AxiosResponse<Error>;
        throw error.data;
    }
};

export const getPage = async (pageId: string) => {
    try {
        const response = await instance<GetPageResponse>(`${prefix}/page/${pageId}`);
        return response.data;
    } catch (e) {
        console.log(e);
        // const error = e.response as AxiosResponse<Error>;
        // throw error.data;
        return null;
    }
};

export const getBlocks = async (blockId: string) => {
    try {
        const response = await instance<GetBlocksResponse[]>(`${prefix}/blocks/${blockId}`);
        return response.data;
    } catch (e) {
        const error = e.response as AxiosResponse<Error>;
        throw error.data;
    }
};

export const getBlock = async (blockId: string) => {
    try {
        const response = await instance<GetBlocksResponse>(`${prefix}/blocks/${blockId}`);
        return response.data;
    } catch (e) {
        const error = e.response as AxiosResponse<Error>;
        throw error.data;
    }
};
