import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

const namespace = '';

export const socket = io(
    process.env.NODE_ENV === 'production' ? `${process.env.TERMINAL_SOCKET_URL}` : `http://localhost:3002/${namespace}`,
    {
        transports: ['websocket'],
    }
);
export const SocketContext = createContext({} as Socket);
