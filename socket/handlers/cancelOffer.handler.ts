import { Types } from "mongoose";
import { IO } from "../schema/socket.type";
import { Events } from "../socket.enum";
import { AcceptStatus } from "../../util";
import { Chat, Message } from "../../models";
import { CustomSocket } from "../schema/socket.interface";
import { validationSocketData } from "./valiation.handler";
import { OfferBody, OfferBodyVal } from "../socket.validation";

export const cancelOffer = async (io: IO, socket: CustomSocket, data: OfferBody) => {
    console.log(`[event] - ${Events.MESSAGE}/cancel`.bgMagenta);
    const userId = socket.user as string;

    try {
        if (!validationSocketData(socket, OfferBodyVal.safeParse, data)) return;

        const message = await Message.findById(data.message);
        if (!message)
            return socket.emit(Events.ERROR, { message: "message not found" });

        const chat = await Chat.findOne({
            _id: new Types.ObjectId(data.chat),
            members: {
                $in: [new Types.ObjectId(userId)],
            },
            isBlocked: false,
        });
        if (!chat)
            return socket.emit(Events.ERROR, { message: "chat not found" });

        if (chat.isOrdered)
            return socket.emit(Events.ERROR, { message: "can negotiate on an ordered service" });

        message.acceptStatus = AcceptStatus.REJECTED;
        chat.isNegotiated = false;
        chat.negotiatedPrice = 0;
        chat.negotiatedDeliveryTime = 0;
        chat.negotiatedRevision = 0;
        await chat.save();
        const updatedMessage = await message.save();

        io.emit(`${Events.MESSAGE}/${data.chat}/cancel`, updatedMessage);

        /* send the oposite party that the other rejected the offer is the if its not been canceled bu the negotiator by him.her self */
    } catch (err) {
        socket.emit(Events.ERROR, { message: "failed to change the status" });
    }
};