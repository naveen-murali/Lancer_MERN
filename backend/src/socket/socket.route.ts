import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { Events } from './socket.enum';
import { SetupSocketIo } from './socket.type';
import { protectSocket } from './socket.middleware';
import {
    CustomSocket,
    InterServerEvents,
    ClientToServerEvents,
    ServerToClientEvents
} from './socket.interface';
import {
    addUser,
    removeUser,
    cancelOffer,
    sendMessage,
    offerAcceptBySeller,
    getStatusOfAUser,
} from './socket.controller';

export const setupSocketIo: SetupSocketIo = (server: HttpServer) => {
    const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, any>(server, {
        cors: {
            origin: "*",
            methods: ["*"],
            credentials: true
        }
    });
    io.use(protectSocket);

    io.on(Events.CONNECTION, (socket: CustomSocket) => {
        addUser(io, (socket.user as string), socket.id);

        socket.on(Events.MESSAGE, (message) => sendMessage(io, socket, message));

        socket.on(`${Events.MESSAGE}/status`, (data) => getStatusOfAUser(socket, data));
        
        socket.on(`${Events.MESSAGE}/cancel`, (data) => cancelOffer(io, socket, data));

        socket.on(`${Events.MESSAGE}/accept`, (data) => offerAcceptBySeller(io, socket, data));

        socket.on(Events.DISCONNECTION, () => removeUser(io, socket.id));
    });
};
