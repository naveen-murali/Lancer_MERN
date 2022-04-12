import { Server } from 'socket.io';
import { redis } from '../config';
import { Types } from 'mongoose';
import { Events } from './socket.enum';
import { Chat, Message } from '../models';
import { CustomSocket } from './socket.interface';
import { AcceptStatus, MessageTypes, Role } from '../util';
import {
    OfferBody,
    OfferBodyVal,
    MessageBody,
    MessageBodyVal,
    StatusEventBodyVal,
    StatusEventBody
} from './socket.validation';
import { IO } from './socket.type';

interface IssuesInter {
    message: string;
}
interface ValidationMiddleware {
    success: boolean;
    error: {
        issues: IssuesInter[];
    };
}
export const validationSocketData = (socket: CustomSocket, validationMethod: any, data: any) => {
    const validation: ValidationMiddleware = validationMethod(data);

    if (!validation.success) {
        console.log('--------------IN socket error [not success]--------------'.bgRed);
        const errors: string[] = validation?.error?.issues?.map(msg => msg.message);

        socket.emit(Events.ERROR, errors);

        return false;
    } else {
        return true;
    }
};


export const addUser = async (io: IO, userId: string, socketId: string) => {
    try {
        await redis.SET(userId, socketId);
        await redis.SET(socketId, userId);

        const chats = await Chat.find({
            members: {
                $in: [new Types.ObjectId(userId)]
            },
            isBlocked: false
        }).exec();

        if (!chats?.length) return;

        chats.forEach(chat => {
            const emitStatus = {
                id: userId,
                status: "online"
            };
            io.emit(`${Events.MESSAGE}/${chat._id.toString()}/status`, emitStatus);
        });

    } catch (err) {
        console.log(err);
    }
};


export const removeUser = async (io: IO, socketId: string) => {
    console.log(`[event] - ${Events.DISCONNECTION}`.bgMagenta);
    try {
        const userId = await redis.GET(socketId);
        await redis.DEL(socketId);
        await redis.DEL((userId as string));

        if (!userId) return;

        const chats = await Chat.find({
            members: {
                $in: [new Types.ObjectId(userId)]
            },
            isBlocked: false
        });

        chats.forEach(chat => {
            const emitStatus = {
                id: userId,
                status: "offline"
            };
            io.emit(`${Events.MESSAGE}/${chat._id.toString()}/status`, emitStatus);
        });

    } catch (err) {
        console.log(err);
    }
};


export const sendMessage = async (io: IO, socket: CustomSocket, message: MessageBody) => {
    console.log(`[event] - ${Events.MESSAGE}`.bgMagenta);
    const sender = socket.user as string;

    try {
        if (!validationSocketData(socket, MessageBodyVal.safeParse, message))
            return;

        const chat = await Chat.findOne({
            _id: new Types.ObjectId(message.chat),
            members: {
                $in: [new Types.ObjectId(sender), new Types.ObjectId(message.receiver)]
            },
            isBlocked: false
        });

        // if chat is exists or not
        if (!chat) {
            socket.emit(Events.ERROR, { message: 'chat not exits' });
            return;
        }

        if (message.type === MessageTypes.FILE) {
            // choosed file but didn't provided its single or multiple??
            if (message.hasMultiple === undefined)
                return socket.emit(Events.ERROR, { message: 'hasMultiple not defined' });

            // multiple file not found
            if (message.hasMultiple && (!message.files || !message.files.length))
                return socket.emit(Events.ERROR, { message: 'files not found' });

            // single file not found.
            if (message.hasMultiple === false && !message.file)
                return socket.emit(Events.ERROR, { message: 'file not found' });
        }


        // handling without negotiation and with negotiation properties
        if (message.type !== MessageTypes.NEGOTIATE &&
            (message.price || message.revision || message.deliveryTime))
            return socket.emit(Events.ERROR, { message: `illegal properties without type ${MessageTypes.NEGOTIATE}` });


        const newMessage = new Message({ ...message, sender });
        if (message.type === MessageTypes.NEGOTIATE) {
            // can't negotiate on an ordered service chat
            if (chat.isOrdered) {
                return socket.emit(Events.ERROR, { message: "can't negotiate on an already ordered service" });
            }

            // checking whether there is any pending negotiation or not.
            const negotiationExists = await Message.exists({
                chat: new Types.ObjectId(message.chat),
                acceptStatus: {
                    $exists: true,
                    $ne: AcceptStatus.REJECTED
                }
            });
            if (negotiationExists)
                return socket.emit(Events.ERROR, { message: 'already a negotiation exists' });

            // checking if there is any value in the negotiation.
            if (message.price || message.revision || message.deliveryTime) {
                chat.isNegotiated = true;
                chat.negotiatedPrice = message.price || chat.negotiatedPrice;
                chat.negotiatedRevision = message.revision || chat.negotiatedRevision;
                chat.negotiatedDeliveryTime = message.deliveryTime || chat.negotiatedDeliveryTime;

                newMessage.acceptStatus = chat.order.seller.toString() === sender.toString()
                    ? AcceptStatus.ACCEPTED : AcceptStatus.PENDING;
            } else {
                socket.emit(Events.ERROR, { message: "doesn't have any negotiation values" });
                return;
            }
        }

        // creating a message and saving it to the database and forwarding to the users.
        const createdMessage = await newMessage.save();
        await chat.save();

        io.emit(`${Events.MESSAGE}/${message.chat}`, createdMessage);
    } catch (err) {
        console.log(err);
        
        socket.emit(Events.ERROR, { message: 'message failed' });
    }
};


export const cancelOffer = async (io: IO, socket: CustomSocket, data: OfferBody) => {
    console.log(`[event] - ${Events.MESSAGE}/cancel`.bgMagenta);
    const userId = socket.user as string;

    try {
        if (!validationSocketData(socket, OfferBodyVal.safeParse, data))
            return;

        const message = await Message.findById(data.message);
        if (!message)
            return socket.emit(Events.ERROR, { message: "message not found" });

        const chat = await Chat.findOne({
            _id: new Types.ObjectId(data.chat),
            members: {
                $in: [new Types.ObjectId(userId)]
            },
            isBlocked: false
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
    } catch (err) {
        socket.emit(Events.ERROR, { message: 'failed to change the status' });
    }
};


export const offerAcceptBySeller = async (io: IO, socket: CustomSocket, data: OfferBody) => {
    console.log(`[event] - ${Events.MESSAGE}/accept`.bgMagenta);
    const userId = socket.user as string;
    const userRole = socket.userRole as Role[];

    try {
        if (!validationSocketData(socket, OfferBodyVal.safeParse, data))
            return;

        const message = await Message.findById(data.message);
        if (!message)
            return socket.emit(Events.ERROR, { message: "message not found" });

        if (message.acceptStatus !== AcceptStatus.PENDING)
            return socket.emit(Events.ERROR, { message: `can not accept an offer which is already ${message.acceptStatus}` });

        const chat = await Chat.findOne({
            _id: new Types.ObjectId(data.chat),
            members: {
                $in: [new Types.ObjectId(userId)]
            },
            isBlocked: false
        });
        if (!chat)
            return socket.emit(Events.ERROR, { message: "chat not found" });

        if (!userRole.some(role => role === Role.SELLER) || chat.order.seller.toString() !== userId.toString())
            return socket.emit(Events.ERROR, { message: "you are no the seller for the chat" });

        message.acceptStatus = AcceptStatus.ACCEPTED;
        const updatedMessage = await message.save();

        io.emit(`${Events.MESSAGE}/${data.chat}/accept`, updatedMessage);
    } catch (err) {
        console.log(err);
        socket.emit(Events.ERROR, { message: 'failed ot accept the negotiation' });
    }
};


export const getStatusOfAUser = async (socket: CustomSocket, data: StatusEventBody) => {
    console.log(`[event] - ${Events.MESSAGE}/status`.bgMagenta);
    const userId = data.user;

    try {
        if (!validationSocketData(socket, StatusEventBodyVal.safeParse, data))
            return;

        const emitStatus = {
            id: data.user,
            status: "offline"
        };
        if (await redis.EXISTS((userId as string)))
            emitStatus.status = "online";

        socket.emit(`${Events.MESSAGE}/${data.chat}/status`, emitStatus);
    } catch (err) {
        console.log(err);
    }
};