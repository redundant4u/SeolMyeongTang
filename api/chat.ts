import { ChatType } from 'types/chat';
import http from './index';

export const getChat = async (): Promise<ChatType[]> => {
    return http.get('', { baseURL: process.env.CHAT_URL });
};
