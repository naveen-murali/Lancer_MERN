import { Types } from "mongoose";
import { AuthorizationResource, RelatedResources, Amount } from "paypal-rest-sdk";
import { IO } from "../schema/socket.type";
import { paypal } from "../../config";
import { Events } from "../socket.enum";
import { CustomSocket } from "../schema/socket.interface";
import { AcceptStatus, MessageTypes, PaymentPlatform } from "../../util";
import { validationSocketData } from "./valiation.handler";
import { BadRequestException, HttpException } from "../../exceptions";
import { Chat, Lancer, Message, Order, SellerInfo } from "../../models";
import { PaymentDetailsBody, PlaceOrderBody, PlaceOrderBodyVal } from "../socket.validation";


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