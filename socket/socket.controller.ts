import { Types } from "mongoose";
import { IO } from "./socket.type";
import { Events } from "./socket.enum";
import { paypal, redis } from "../config";
import { CustomSocket } from "./socket.interface";
import { BadRequestException, HttpException } from "../exceptions";
import { AcceptStatus, MessageTypes, PaymentPlatform, Role } from "../util";
import { AuthorizationResource, RelatedResources, Amount } from "paypal-rest-sdk";
import { User, Chat, Order, Lancer, Service, Message, SellerInfo } from "../models";
import {
    OfferBody,
    OfferBodyVal,
    MessageBody,
    MessageBodyVal,
    StatusEventBodyVal,
    StatusEventBody,
    PlaceOrderBodyVal,
    PlaceOrderBody,
    PaymentDetailsBody,
} from "./socket.validation";

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
        console.log("--------------IN socket error [not success]--------------".bgRed);
        const errors: string[] = validation?.error?.issues?.map((msg) => msg.message);

        socket.emit(Events.ERROR, errors);
        return false;
    } else return true;
};

export const addUser = async (io: IO, userId: string, socketId: string) => {
    console.log(`[event] - ${Events.CONNECTION}`.bgMagenta);
    try {
        await redis.SET(userId, socketId);
        await redis.SET(socketId, userId);
        // await redis.RPUSH(REDIS.USER_LIST, userId);
        const chats = await Chat.find({
            members: {
                $in: [new Types.ObjectId(userId)],
            },
            isBlocked: false,
        }).exec();

        if (!chats?.length) return;

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

export const removeUser = async (io: IO, socketId: string) => {
    console.log(`[event] - ${Events.DISCONNECTION}`.bgMagenta);
    try {
        const userId = await redis.GET(socketId);
        await redis.DEL(socketId);
        await redis.DEL(userId as string);
        
        if (!userId)return;

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

        // await redis.LREM(REDIS.USER_LIST, 1, userId);
    } catch (err) {
        console.log(err);
    }
};

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
        
        io.emit(`${Events.MESSAGE}/${message.chat}`, createdMessage);
        await chat.save();

        /* sending message notification */
    } catch (err) {
        console.log(err);

        socket.emit(Events.ERROR, { message: "message failed" });
    }
};

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

export const offerAcceptBySeller = async (io: IO, socket: CustomSocket, data: OfferBody) => {
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

type returndata = {
    autherizeId: string;
    amount: Amount;
    createdAt: string;
    updatedAt: string;
};
const autherizePayment = async (details: PaymentDetailsBody) => {
    return new Promise(async (resolve, reject) => {
        let execute_payment_json = {
            payer_id: details.PayerID,
        };

        paypal.payment.execute(details.paymentId, execute_payment_json, (error, payment) => {
            if (error) {
                console.log(error.response);
                return reject(new HttpException(403, "failed to authrize the payment"));
            }

            const autherizeId = ((payment.transactions[0].related_resources as RelatedResources[])[0]
                    .authorization as AuthorizationResource).id;
            const amount = ((payment.transactions[0].related_resources as RelatedResources[])[0]
                    .authorization as AuthorizationResource).amount;

            const createdAt = payment.create_time;
            const updatedAt = payment.update_time;

            resolve({
                autherizeId,
                amount,
                createdAt,
                updatedAt,
            });
        });
    });
};

const capturePayment = async (autherizeId: string, amount: Amount) => {
    return new Promise(async (resolve, reject) => {
        delete amount.details;
        let capture_details = {
            is_final_capture: true,
            amount,
        };

        paypal.authorization.capture(autherizeId, capture_details,
            function (error, capture) {
                if (error) {
                    console.log(error);
                    return reject(new HttpException(403, "failed to capture the payment"));
                } else {
                    return resolve(capture.id);
                }
            });
    });
};

export const placeOrder = async (io: IO, socket: CustomSocket, orderData: PlaceOrderBody) => {
    console.log(`[event] - ${Events.ORDER}`.bgMagenta);
    const userId = socket.user as string;

    try {
        if (!validationSocketData(socket, PlaceOrderBodyVal.safeParse, orderData)) return;

        if (
            orderData.platform !== PaymentPlatform.PAYPAL &&
            orderData.platform !== PaymentPlatform.STRIP
        )
            throw new BadRequestException("invalied payment platform");

        const [messageExists, chat] = await Promise.all([
            Message.exists({
                chat: new Types.ObjectId(orderData.chat),
                acceptStatus: {
                    $exists: true,
                    $ne: AcceptStatus.REJECTED,
                },
            }),
            Chat.findById(orderData.chat),
        ]);

        if (!chat)
            return socket.emit(Events.ERROR, { message: "chat not found" });

        if (chat.order.buyer.toString() !== userId.toString())
            return socket.emit(Events.ERROR, { message: "unautherized user" });

        if (chat.isOrdered)
            return socket.emit(Events.ERROR, { message: "order is already been placed" });

        if (!messageExists)
            return socket.emit(Events.ERROR, { message: "unsolved negotiation exists" });

        const data = (await autherizePayment(orderData.paymentDetails)) as unknown as returndata;
        const captureId = await capturePayment(data.autherizeId, data.amount);

        const lancer = await Lancer.findOne();
        if (!lancer)
            throw new Error("lancer document is not found");

        const newOrder = new Order({
            chat: orderData.chat,
            isPaied: true,
            paymentDetails: {
                platform: orderData.platform,
                paymentId: orderData.paymentDetails.paymentId,
                commission: lancer.commission,
                capturedId: captureId,
                amount: chat.isNegotiated ? chat.negotiatedPrice : chat.package.price,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            },
            buyer: chat.order.buyer,
            seller: chat.order.seller,
            service: chat.order.service,
            package: chat.order.package,
            isNegotiated: chat.isNegotiated,
            price: chat.isNegotiated ? chat.negotiatedPrice : chat.package.price,
            deliveryTime: chat.isNegotiated
                ? chat.negotiatedDeliveryTime
                : chat.package.deliveryTime,
            revision: chat.isNegotiated ? chat.negotiatedRevision : chat.package.revision,
            remainingRevision: chat.isNegotiated ? chat.negotiatedRevision : chat.package.revision,
        });
        const createdOrder = await newOrder.save();

        // updating the admin wallet
        lancer.wallet = createdOrder.price;
        lancer.save().catch(() => {});

        // updating the seller earings
        const sellerEarning = createdOrder.price - (createdOrder.price * lancer.commission) / 100;
        SellerInfo.findOneAndUpdate(
            {
                user: createdOrder.seller,
            },
            {
                $inc: {
                    sellerEarning: +sellerEarning,
                },
            }
        ).then((data) => {
            /* Notification to the seller */
        });

        chat.isOrdered = true;
        chat.save().catch(() => {});

        const newMessage = new Message({
            chat: orderData.chat,
            type: MessageTypes.NOTIFICATION,
            description: `Order has been placed for the "Rs. ${createdOrder.price}" ${
                createdOrder.isNegotiated ? "through negotiation." : "without any negotiation."
            }`,
        });
        const createMessage = await newMessage.save();

        io.emit(`${Events.MESSAGE}/${orderData.chat}`, createMessage);

        /* send notification to both users in the chat that order is placed */
    } catch (err) {
        console.log(err);
        socket.emit(Events.ERROR, { message: "failed to create order" });
    }
};

export const addWatchPipeline = (socket: CustomSocket) => {
    Lancer.watch([], { fullDocument: "updateLookup" })
        .on("change", (data) => {
            socket.emit(Events.LANCER, data.fullDocument);
        });

    User.watch([{
        $match: { operationType: "insert" },
    }]).on("change", async () => {
        try {
            const totalUsers = await User.countDocuments();
            socket.emit(Events.NEW_COUNT, { totalUsers });
        } catch (err) {
            console.log(err);
        }
    });

    Order.watch([{
        $match: { operationType: "insert" },
    }]).on("change", async () => {
        try {
            const totalOrders = await Order.countDocuments();
            socket.emit(Events.NEW_COUNT, { totalOrders });
        } catch (err) {
            console.log(err);
        }
    });

    Service.watch([{
        $match: { operationType: "insert" },
    }]).on("change", async () => {
        try {
            const totalService = await Service.countDocuments();
            socket.emit(Events.NEW_COUNT, { totalService });
        } catch (err) {
            console.log(err);
        }
    });

    Chat.watch([{
        $match: { operationType: "insert" },
    }]).on("change", async () => {
        try {
            const totalChat = await Chat.countDocuments();
            socket.emit(Events.NEW_COUNT, { totalChat });
        } catch (err) {
            console.log(err);
        }
    });
};
