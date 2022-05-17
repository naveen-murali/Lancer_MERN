import { Types } from "mongoose";
import { IO } from "../schema/socket.type";
import { Chat } from "../../models";
import { redis } from "../../config";
import { Events } from "../socket.enum";

export const addUser = async (io: IO, userId: string, socketId: string) => {
    console.log(`[event] - ${Events.CONNECTION}`.bgMagenta);
    try {
        await redis.SET(userId, socketId);
        await redis.SET(socketId, userId);

        const chats = await Chat.find({
            members: {
                $in: [new Types.ObjectId(userId)],
            },
            isBlocked: false,
        }).exec();

        if (!chats?.length)
            return;

        chats.forEach((chat) => {
            const emitStatus = {
                id: userId,
                status: "online",
            };
            io.emit(`${Events.MESSAGE}/${chat._id.toString()}/status`, emitStatus);
        });
    } catch (err) {
        console.log(err);
    }
};