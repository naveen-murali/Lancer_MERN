import { Types } from "mongoose";
import { IO } from "../schema/socket.type";
import { Chat } from "../../models";
import { redis } from "../../config";
import { Events } from "../socket.enum";

export const removeUser = async (io: IO, socketId: string) => {
    console.log(`[event] - ${Events.DISCONNECTION}`.bgMagenta);
    try {
        const userId = await redis.GET(socketId);
        await redis.DEL(socketId);
        await redis.DEL(userId as string);

        if (!userId) return;

        const chats = await Chat.find({
            members: {
                $in: [new Types.ObjectId(userId)],
            },
            isBlocked: false,
        });

        chats.forEach((chat) => {
            const emitStatus = {
                id: userId,
                status: "offline",
            };
            io.emit(`${Events.MESSAGE}/${chat._id.toString()}/status`, emitStatus);
        });
    } catch (err) {
        console.log(err);
    }
};
