export type GetSessionsResponse = {
    name: string;
    sessionId: string;
    image: string;
    description: string;
};

export type CreateSessionRequest = {
    name: string;
    image: string;
    description: string;
};

export type CreateSessionResponse = {
    name: string;
    sessionId: string;
    image: string;
    description: string;
};

export type DeleteSessionRequest = {
    sessionId: string;
};

export type CreateClientIdResponse = {
    clientId: string;
};

export type SessionType = {
    id: string;
    name: string;
    image: string;
    description: string;
    href: string;
};
