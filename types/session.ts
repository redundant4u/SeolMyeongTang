export type GetSessionsResponse = {
    name: string;
    sessionId: string;
};

export type CreateSessionRequest = {
    name: string;
};

export type CreateSessionResponse = {
    name: string;
    sessionId: string;
};

export type DeleteSessionRequest = {
    sessionId: string;
};

export type SessionType = {
    id: string;
    name: string;
    href: string;
};
