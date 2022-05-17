import { redis } from "../../config";
import { Events } from "../socket.enum";
import { CustomSocket } from "../schema/socket.interface";
import { validationSocketData } from "./valiation.handler";
import { StatusEventBody, StatusEventBodyVal } from "../socket.validation";

export const getStatusOfUser = async (socket: CustomSocket, data: StatusEventBody) => {
    console.log(`[event] - ${Events.MESSAGE}/status`.bgMagenta);
    const userId = data.user;

    try {
        if (!validationSocketData(socket, StatusEventBodyVal.safeParse, data)) return;

        const emitStatus = {
            id: data.user,
            status: "offline",
        };
        if (await redis.EXISTS(userId as string))
            emitStatus.status = "online";

        socket.emit(`${Events.MESSAGE}/${data.chat}/status`, emitStatus);
    } catch (err) {
        console.log(err);
        socket.emit(Events.ERROR, { message: "failed to fetch the status" });
    }
};