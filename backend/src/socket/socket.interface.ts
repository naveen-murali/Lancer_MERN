import { Socket } from 'socket.io';
import { Role } from '../util';

export interface ServerToClientEvents {
    message: (a: string) => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
    users: (userId: string) => void;
    message: () => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    name: string;
    age: number;
}

export interface CustomSocket extends Socket {
    user?: string;
    userRole?: Role[];
}