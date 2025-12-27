import {
    CreateSessionRequest,
    CreateSessionResponse,
    DeleteSessionRequest,
    CreateClientIdResponse,
    GetSessionsResponse,
} from 'types/session';
import http from './index';

export const getSessions = async (clientId: string): Promise<GetSessionsResponse[]> => {
    return http.get('session', {
        headers: {
            'X-Client-Id': clientId,
        },
    });
};

export const createSession = async (clientId: string, data: CreateSessionRequest): Promise<CreateSessionResponse> => {
    return http.post('session', {
        headers: {
            'X-Client-Id': clientId,
        },
        data,
    });
};

export const deleteSession = async (clientId: string, data: DeleteSessionRequest): Promise<void> => {
    return http.delete('session', {
        headers: {
            'X-Client-Id': clientId,
        },
        data,
    });
};

export const createClientId = async (): Promise<CreateClientIdResponse> => {
    return http.post('session/client-id');
};
