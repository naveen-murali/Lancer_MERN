import { Server } from "socket.io";
import { Events } from "./socket.enum";
import { Server as HttpServer } from "http";
import { SetupSocketIo } from "./schema/socket.type";
import { protectSocket } from "./socket.middleware";
import {
    CustomSocket,
    InterServerEvents,
    ClientToServerEvents,
    ServerToClientEvents,
} from "./schema/socket.interface";
import {
    addUser,
    removeUser,
    cancelOffer,
    sendMessage,
    offerAccept,
    getStatusOfUser,
    placeOrder,
    addWatchPipelineForAdmin,
    addWatchPipelineForUser,
} from "./handlers";
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

    io.use(protectSocket);

    io.on(Events.CONNECTION, async (socket: CustomSocket) => {
        if ((socket.userRole as Role[])[0] === Role.ADMIN) {
            addWatchPipelineForAdmin(socket);
        } else {
            addUser(io, socket.user as string, socket.id);

            addWatchPipelineForUser(io, socket)

            socket.on(Events.MESSAGE, (message) => sendMessage(io, socket, message));

            socket.on(`${Events.MESSAGE}/status`, (data) => getStatusOfUser(socket, data));

            socket.on(`${Events.MESSAGE}/cancel`, (data) => cancelOffer(io, socket, data));

            socket.on(`${Events.MESSAGE}/accept`, (data) => offerAccept(io, socket, data));

            socket.on(`${Events.ORDER}`, (data) => placeOrder(io, socket, data));

            socket.on(Events.DISCONNECTION, () => removeUser(io, socket.id));
        }
    });
};
