import { Types } from "mongoose";
import { IO } from "../schema/socket.type";
import { Events } from "../socket.enum";
import { Chat, Message } from "../../models";
import { CustomSocket } from "../schema/socket.interface";
import { AcceptStatus, MessageTypes } from "../../util";
import { validationSocketData } from "./valiation.handler";
import { MessageBody, MessageBodyVal } from "../socket.validation";

export const sendMessage = async (io: IO, socket: CustomSocket, message: MessageBody) => {
    console.log(`[event] - ${Events.MESSAGE}`.bgMagenta);
    const sender = socket.user as string;

    try {
        if (!validationSocketData(socket, MessageBodyVal.safeParse, message)) return;

        const chat = await Chat.findOne({
            _id: new Types.ObjectId(message.chat),
            members: {
                $in: [new Types.ObjectId(sender), new Types.ObjectId(message.receiver)],
            },
            isBlocked: false,
        });

        // checking if reciver exists
        if (!message.receiver)
            return socket.emit(Events.ERROR, { message: "reciver is not mensioned" });

        // if chat is exists or not
        if (!chat)
            return socket.emit(Events.ERROR, { message: "chat not exits" });

        if (message.type === MessageTypes.FILE) {
            // choosed file but didn't provided its single or multiple??
            if (message.hasMultiple === undefined)
                return socket.emit(Events.ERROR, { message: "hasMultiple not defined" });

            // multiple file not found
            if (message.hasMultiple && (!message.files || !message.files.length))
                return socket.emit(Events.ERROR, { message: "files not found" });

            // single file not found.
            if (message.hasMultiple === false && !message.file)
                return socket.emit(Events.ERROR, { message: "file not found" });
        }

        // handling without negotiation and with negotiation properties
        if (
            message.type !== MessageTypes.NEGOTIATE &&
            (message.price || message.revision || message.deliveryTime)
        )
            return socket.emit(Events.ERROR, {
                message: `illegal properties without type ${MessageTypes.NEGOTIATE}`,
            });

        const newMessage = new Message({ ...message, sender });
        if (message.type === MessageTypes.NEGOTIATE) {
            // can't negotiate on an ordered service chat
            if (chat.isOrdered) 
                return socket.emit(Events.ERROR, {
                    message: "can't negotiate on an already ordered service",
                });

            // checking whether there is any pending negotiation or not.
            const negotiationExists = await Message.exists({
                chat: new Types.ObjectId(message.chat),
                acceptStatus: {
                    $exists: true,
                    $ne: AcceptStatus.REJECTED,
                },
            });

            if (negotiationExists)
                return socket.emit(Events.ERROR, { message: "already a negotiation exists" });

            // checking if there is any value in the negotiation.
            if (message.price || message.revision || message.deliveryTime) {
                chat.isNegotiated = true;
                chat.negotiatedPrice = message.price || chat.negotiatedPrice;
                chat.negotiatedRevision = message.revision || chat.negotiatedRevision;
                chat.negotiatedDeliveryTime = message.deliveryTime || chat.negotiatedDeliveryTime;

                newMessage.acceptStatus =
                    chat.order.seller.toString() === sender.toString()
                        ? AcceptStatus.ACCEPTED
                        : AcceptStatus.PENDING;
            } else {
                socket.emit(Events.ERROR, { message: "doesn't have any negotiation values" });
                return;
            }
        }

        // creating a message and saving it to the database and forwarding to the users.
        const createdMessage = await newMessage.save();
        
        socket.emit(`${Events.MESSAGE}/${message.chat}`, createdMessage);
        await chat.save();

        /* sending message notification */
    } catch (err) {
        console.log(err);

        socket.emit(Events.ERROR, { message: "message failed" });
    }
};