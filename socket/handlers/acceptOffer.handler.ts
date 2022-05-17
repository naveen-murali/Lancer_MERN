import { Types } from "mongoose";
import { IO } from "../schema/socket.type";
import { Events } from "../socket.enum";
import { Chat, Message } from "../../models";
import { AcceptStatus, Role } from "../../util";
import { CustomSocket } from "../schema/socket.interface";
import { validationSocketData } from "./valiation.handler";
import { OfferBody, OfferBodyVal } from "../socket.validation";

export const offerAccept = async (io: IO, socket: CustomSocket, data: OfferBody) => {
    console.log(`[event] - ${Events.MESSAGE}/accept`.bgMagenta);
    const userId = socket.user as string;
    const userRole = socket.userRole as Role[];

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

        if (
            !userRole.some((role) => role === Role.SELLER) ||
            chat.order.seller.toString() !== userId.toString()
        )
            return socket.emit(Events.ERROR, { message: "you are no the seller for the chat" });

        if (message.acceptStatus !== AcceptStatus.PENDING)
            return socket.emit(Events.ERROR, {
                message: `can not accept an offer which is already ${message.acceptStatus}`,
            });

        message.acceptStatus = AcceptStatus.ACCEPTED;
        const updatedMessage = await message.save();

        io.emit(`${Events.MESSAGE}/${data.chat}/accept`, updatedMessage);

        /* send notification to buyer that the seller is accepted the offer if the negotiation offer is not done by the seller */
    } catch (err) {
        console.log(err);
        socket.emit(Events.ERROR, { message: "failed ot accept the negotiation" });
    }
};