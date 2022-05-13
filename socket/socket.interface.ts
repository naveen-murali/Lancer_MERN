import { Socket } from "socket.io";
import { Role } from "../util";
import { Events } from "./socket.enum";

export interface ServerToClientEvents {
    [Events.MESSAGE]: (a: string) => void;
    [Events.LANCER]: (callback: (e: number) => void) => void;
    [Events.NEW_COUNT]: (callback: (e: number) => void) => void;
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
