import moment from 'moment';
import { OrderSearchModel } from '../interface';
import { Order, User, Transaction, Message } from '../models';
import { BadRequestException, HttpException, NotFoundException } from '../exceptions';
import { CompletionLevel, OrderSearchType, OrderStatus, TransactionType, AcceptStatus } from '../util';
import { ChatService } from './chat.service';
import { LancerService } from './lancer.service';

export class OrderService {
    private User = User;
    private Order = Order;
    private Message = Message;
    private Transaction = Transaction;

    private chatService = new ChatService();
    private lancerService = new LancerService();


    getAllOrders = async (userId: string, query: OrderSearchModel) => {
        const pageSize = Number(query.pageSize) || 10;
        const page = Number(query.page) || 1;

        if (query.type && (query.type !== OrderSearchType.SELLING && query.type !== OrderSearchType.BUYING))
            throw new BadRequestException(`type should be ${OrderSearchType.SELLING} or ${OrderSearchType.BUYING}`);

        const keyword = query.type
            ? query.type === OrderSearchType.SELLING
                ? { seller: userId }
                : { buyer: userId }
            : {
                $or: [
                    {
                        buyer: { $eq: userId }
                    },
                    {
                        seller: { $eq: userId }
                    }
                ],
            };

        const count = await this.Order.countDocuments({ ...keyword });
        const orders = await this.Order.find({ ...keyword })
            .sort(query.sort || { _id: -1 })
            .limit(pageSize)
            .skip((page - 1) * pageSize);

        return {
            type: query.type,
            orders,
            page,
            pageSize,
            pages: Math.ceil(count / pageSize)
        };
    };


    completeOrder = async (userId: string, orderId: string) => {
        const order = await this.getOneOrder(userId, orderId);

        if (order.status === OrderStatus.CANCELLED)
            throw new NotFoundException("order has already been cancelled");

        if (order.seller.toString() === userId.toString()) {
            order.completionLevel.seller = CompletionLevel.COMPLETED;

            await order.save();
            return true;
        }

        if (order.buyer.toString() === userId.toString()) {
            if (order.completionLevel.seller !== CompletionLevel.COMPLETED)
                throw new BadRequestException("seller did not completed the order");

            const lancer = await this.lancerService.getLancer();
            if (!lancer)
                throw new HttpException(500, "failed to complete the order");

            order.completionLevel.buyer = CompletionLevel.COMPLETED;
            order.status = OrderStatus.COMPLETED;
            const sellerPrice = order.price - (order.price * lancer.commission / 100);

            await Promise.all([
                order.save(),
                this.User.findByIdAndUpdate(order.seller, {
                    $inc: { wallet: +sellerPrice }
                }).exec()
            ]);

            const completeAt = moment(order.updatedAt).format("MMMM Do, YYYY");
            const message = `order completd on ${completeAt}`;
            await this.chatService.sendNotification(order.chat, message);

            return true;
        }

        throw new HttpException(401, "invalied credential");
    };


    takeRevision = async (userId: string, orderId: string) => {
        const order = await this.getOneOrder(userId, orderId);

        if (order.buyer.toString() !== userId.toString())
            throw new HttpException(401, "invalied credential");

        if (order.status === OrderStatus.CANCELLED)
            throw new NotFoundException("order has already been cancelled");

        if (order.completionLevel.seller !== CompletionLevel.COMPLETED)
            throw new BadRequestException("seller did not complete the order yet");

        if (order.remainingRevision === 0)
            throw new BadRequestException("you don't have any revision left to take");

        order.remainingRevision--;
        order.completionLevel.seller = CompletionLevel.ONGOING;
        order.completionLevel.buyer = CompletionLevel.ONGOING;
        await order.save();

        const message = `buyer took an revision. now ${order.remainingRevision} revision remaining`;
        await this.chatService.sendNotification(order.chat, message);
        return true;
    };


    cancelOrder = async (userId: string, orderId: string) => {
        const order = await this.getOneOrder(userId, orderId);

        if (order.status !== OrderStatus.ONGOING)
            throw new BadRequestException("this is not an ongoing order", [`order is already been ${order.status}`]);

        if (order.remainingRevision !== order.revision)
            throw new BadRequestException("can not cancel the order", ["revision is already been taken"]);

        order.status = OrderStatus.CANCELLED;
        await Promise.all([
            order.save(),
            this.chatService.removeOrderFromChat(order.chat),
            this.Message.findOneAndUpdate(
                {
                    chat: order.chat,
                    acceptStatus: AcceptStatus.ACCEPTED
                },
                {
                    $set: {
                        acceptStatus: AcceptStatus.REJECTED
                    }
                })
        ]);

        const cancelledBy = order.buyer.toString() === userId.toString() ? "buyer" : "seller";
        const cancelledAt = moment(order.createdAt).format("MMMM Do, YYYY");
        const message = `order has been cancelled by ${cancelledBy} on ${cancelledAt}`;

        /* send notification regarding on the cancellation of the order */

        Promise.all([
            this.chatService.sendNotification(order.chat, message),
            this.Transaction.create({
                user: userId,
                type: TransactionType.REFUND,
                price: order.price,
                order: order._id,
                orderPaymentDetails: order.paymentDetails
            })
        ]);

        return true;
    };


    getOneOrder = async (userId: string, orderId: string) => {
        const order = await this.Order.findOne({
            _id: orderId,
            $or: [
                {
                    buyer: { $eq: userId }
                },
                {
                    seller: { $eq: userId }
                }
            ],
        });

        if (!order)
            throw new NotFoundException("order not found");

        return await order.save();
    };

}
