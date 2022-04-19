import { paypal } from '../config';
import { LancerService } from './lancer.service';
import { UserService } from './users.service';
import { Chat, Transaction, User } from '../models';
import { CreateWithdrawalRequestBody, validateEnum } from '../validation';
import { OrderModel, TransactionSearchModel, UserModel } from '../interface';
import { BadRequestException, HttpException, NotFoundException } from '../exceptions';
import { inrToUsdRate, PaymentPlatform, PaypalRefundStatus, TransactionStatus, TransactionType } from '../util';

export class TransactionService {
    private Transaction = Transaction;
    private Chat = Chat;
    private User = User;

    private userService = new UserService();
    private lancerService = new LancerService();

    getAllTransactions = async (query: TransactionSearchModel) => {
        const pageSize = Number(query.pageSize) || 10;
        const page = Number(query.page) || 1;

        query.type && validateEnum(TransactionType, query.type);
        query.status && validateEnum(TransactionStatus, query.status);

        const keyword = query.type
            ? {
                type: query.type || { $exists: true },
                status: query.status || { $exists: true }
            }
            : {};


        const [count, transactions] = await Promise.all([
            this.Transaction.countDocuments({ ...keyword }).exec(),
            this.Transaction.find({ ...keyword })
                .sort(query.sort || { _id: 1 })
                .limit(pageSize)
                .skip((page - 1) * pageSize)
                .exec()
        ]);

        return {
            type: query.type,
            status: query.status,
            transactions,
            page,
            pageSize,
            pages: Math.ceil(count / pageSize)
        };
    };


    getUserTransactions = async (userId: string, query: TransactionSearchModel) => {
        const pageSize = Number(query.pageSize) || 10;
        const page = Number(query.page) || 1;

        query.type && validateEnum(TransactionType, query.type);
        query.status && validateEnum(TransactionStatus, query.status);

        const keyword = query
            ? {
                user: userId,
                type: query.type || { $exists: true },
                status: query.status || { $exists: true }
            }
            : { user: userId };


        const [count, transactions] = await Promise.all([
            this.Transaction.countDocuments({ ...keyword }).exec(),
            this.Transaction.find({ ...keyword })
                .sort(query.sort || { _id: 1 })
                .limit(pageSize)
                .skip((page - 1) * pageSize)
                .exec()
        ]);

        return {
            type: query.type,
            status: query.status,
            transactions,
            page,
            pageSize,
            pages: Math.ceil(count / pageSize)
        };
    };


    createPaypalPyament = (userId: string, chatId: string) => {
        return new Promise(async (resolve, reject) => {
            const chat = await this.Chat.findOne({
                _id: chatId,
                members: {
                    $in: [userId]
                },
                isBlocked: false
            });

            if (!chat)
                return reject(new NotFoundException("chat not found"));

            if (chat.isOrdered)
                return reject(new HttpException(401, "chat is already been ordered"));

            if (chat.order.buyer.toString() !== userId.toString())
                return reject(new NotFoundException("invalied credential"));

            const orderPrice = chat.isNegotiated ? chat.negotiatedPrice : chat.package.price;
            const usdPrice = Number(await inrToUsdRate());

            if (!usdPrice)
                return reject(new BadRequestException("failed to convert the order price"));

            let create_payment_json = {
                intent: "authorize",
                payer: {
                    payment_method: "paypal"
                },
                redirect_urls: {
                    return_url: `${process.env.APP_URL}`,
                    cancel_url: `${process.env.APP_URL}`
                },
                transactions: [{
                    amount: {
                        currency: "USD",
                        total: `${(orderPrice / usdPrice).toFixed(2)}`
                    },
                }]
            };

            paypal.payment.create(create_payment_json, (error, payment) => {
                if (error) {
                    console.log(error);
                    return reject(new BadRequestException("failed to create payment"));
                }

                const paymentId = payment.id;
                const approvalUrl = payment.links?.find(data => data.rel === "approval_url");
                resolve({ paymentId, approvalUrl });
            });
        });
    };


    withdrawRequest = async (user: UserModel, withdrawData: CreateWithdrawalRequestBody) => {
        const wallet = user.wallet;

        if (withdrawData.amount < 1000)
            throw new BadRequestException("minimum widrowal amount is 1000");

        if (wallet < withdrawData.amount)
            throw new BadRequestException("you don't have sufficient amount to withdraw");

        const createdWithdrawReq = await this.Transaction.create({
            user: user._id,
            type: TransactionType.WITHDRAW,
            price: withdrawData.amount,
            withdrawalDetails: {
                price: withdrawData.amount,
                account: withdrawData.account
            }
        });
        return createdWithdrawReq;
    };


    withdrawTransaction = async (transactionId: string) => {
        const transaction = await this.Transaction.findById(transactionId);

        if (!transaction)
            throw new NotFoundException("transaction not found");

        transaction.status = TransactionStatus.COMPLETED;
        await Promise.all([
            transaction.save(),
            this.User.findByIdAndUpdate(transaction.user,
                {
                    $inc: {
                        withdrawedWallet: +transaction.price,
                        wallet: -transaction.price
                    }
                }),
            this.lancerService.reduceAmountFromWallet(transaction.price)
        ]);

        return true;
    };


    refundTransaction = async (transactionId: string) => {
        const transaction = await this.Transaction.findById(transactionId)
            .populate('order', 'seller')
            .exec();

        if (!transaction)
            throw new NotFoundException("transaction not found");

        if (transaction.orderPaymentDetails.platform === PaymentPlatform.PAYPAL) {
            const refundId = await this.paypalRefund(transaction.orderPaymentDetails.capturedId);

            transaction.status = TransactionStatus.COMPLETED;
            transaction.refundDetails = {
                id: (refundId as string),
                status: PaypalRefundStatus.COMPLETED
            };

            const orderAmount = transaction.orderPaymentDetails.amount;
            const orderCommission = transaction.orderPaymentDetails.commission;
            const dedcuctionAmount = this.cutCommission(orderAmount, orderCommission);

            await Promise.all([
                transaction.save(),
                this.userService.deductFromSellerEarnings(
                    ((transaction.order as OrderModel).seller as string),
                    dedcuctionAmount
                ),
                this.lancerService.reduceAmountFromWallet(orderAmount)
            ]);
            return true;
        }

        if (transaction.orderPaymentDetails.platform === PaymentPlatform.STRIP) {
            return true;
        }

        throw new BadRequestException("refund failed");
    };


    cancelTransaction = async (transactionId: string) => {
        const transaction = await this.Transaction.findById(transactionId).exec();

        if (!transaction)
            throw new NotFoundException("transaction not found");

        if (transaction.status === TransactionStatus.REJECTED)
            throw new BadRequestException("transaction is already been cancelled");

        transaction.status = TransactionStatus.REJECTED;
        await transaction.save();

        return true;
    };


    cutCommission(amount: number, commission: number) {
        return amount - (amount * commission / 100);
    };


    paypalRefund = (id: string) => {
        return new Promise(async (resolve, reject) => {
            paypal.capture.refund(id, {}, function (error, refund) {
                if (error) {
                    console.log(error);
                    reject(new HttpException(403, "refund failed"));
                } else {
                    resolve(refund.id);
                }
            });
        });
    };

}


