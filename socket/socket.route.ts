import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { createAdapter } from "@socket.io/redis-adapter";
import { Events } from "./socket.enum";
import { redis, subClient } from "../config";
import { SetupSocketIo } from "./socket.type";
import { protectSocket } from "./socket.middleware";
import {
    CustomSocket,
    InterServerEvents,
    ClientToServerEvents,
    ServerToClientEvents,
} from "./socket.interface";
import {
    addUser,
    removeUser,
    cancelOffer,
    sendMessage,
    offerAcceptBySeller,
    getStatusOfUser,
    placeOrder,
    addWatchPipeline,
} from "./socket.controller";
import { Role } from "../util";

export const setupSocketIo: SetupSocketIo = (server: HttpServer) => {
    const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, any>(
        server,
        {
            cors: {
                origin: "*",
                methods: ["*"],
                credentials: true,
            },
        }
    );

    io.adapter(createAdapter(redis, subClient));
    io.use(protectSocket);

    io.on(Events.CONNECTION, async (socket: CustomSocket) => {
        if ((socket.userRole as Role[])[0] === Role.ADMIN) {
            addWatchPipeline(socket);
        } else {
            addUser(io, socket.user as string, socket.id);

            socket.on(Events.MESSAGE, (message) => sendMessage(io, socket, message));

            socket.on(`${Events.MESSAGE}/status`, (data) => getStatusOfUser(socket, data));

            socket.on(`${Events.MESSAGE}/cancel`, (data) => cancelOffer(io, socket, data));

            socket.on(`${Events.MESSAGE}/accept`, (data) => offerAcceptBySeller(io, socket, data));

            socket.on(`${Events.ORDER}`, (data) => placeOrder(io, socket, data));

            socket.on(Events.DISCONNECTION, () => removeUser(io, socket.id));
        }
    });
};
