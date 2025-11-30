import { CreateSessionRequest, CreateSessionResponse, GetSessionsResponse } from 'types/session';
import http from './index';

const SESSION_API_ENDPOINT = process.env.NEXT_PUBLIC_SESSION_API_ENDPOINT;

export const getSessions = async (): Promise<GetSessionsResponse[]> => {
    return http.get('session', {
        baseURL: SESSION_API_ENDPOINT,
    });
};

export const createSession = async (data: CreateSessionRequest): Promise<CreateSessionResponse> => {
    return http.post('session', {
        baseURL: SESSION_API_ENDPOINT,
        data,
    });
};
