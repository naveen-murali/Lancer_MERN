import { Server } from "socket.io";
import { Server as HttpServer } from "http";

export type SetupSocketIo = (server: HttpServer) => void;

export type IO = Server;
