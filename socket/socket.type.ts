import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';

export type SetupSocketIo = (server: HttpServer) => void;

export type IO = Server;