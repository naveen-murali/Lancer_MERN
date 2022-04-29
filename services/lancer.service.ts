import { Types } from 'mongoose';
import { BadRequestException, NotFoundException } from '../exceptions';
import { OrderSearchModel } from '../interface';
import { Lancer, User, Order, Service, Chat } from '../models';
import { Coll, OrderSearchType } from '../util';
import { UpdateLancerBody } from '../validation';

export class LancerService {
    private Lancer = Lancer;
    private User = User;
    private Order = Order;
    private Service = Service;
    private Chat = Chat;


    getLancer = async () => {
        return await this.Lancer.findOne();
    };


    updateLancer = async (amount: UpdateLancerBody) => {
        const lancer = await this.Lancer.findOne();
        if (!lancer)
            throw new NotFoundException("lancer account is not found");

        lancer.commission = amount.commission || lancer.commission;
        lancer.referralAmount = amount.referralAmount || lancer.referralAmount;

        await lancer.save();
        return true;
    };


    getLancersCounts = async () => {
        const [totalUsers, totalOrders, totalService, totalChat] = await Promise.all([
            this.User.countDocuments(),
            this.Order.countDocuments(),
            this.Service.countDocuments(),
            this.Chat.countDocuments()
        ]);

        return { totalUsers, totalOrders, totalService, totalChat };
    };


    getOneUserDetails = async (userId: string) => {
        const user = await this.User.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(userId)
                },
            },
            {
                $lookup: {
                    from: Coll.SAVE_LIST,
                    let: { user: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$$user", "$user"]
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                count: {
                                    $size: "$saveList"
                                }
                            }
                        }
                    ],
                    as: "saveList"
                }
            },
            {
                $unwind: {
                    path: "$saveList",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    saveListCount: {
                        $cond: [
                            {
                                $gt: ["$saveList", null]
                            },
                            "$saveList.count",
                            0
                        ]
                    }
                }
            },
            {
                $unset: "saveList"
            }
        ]);

        if (!user[0])
            throw new BadRequestException("user not found");

        return user[0];
    };


    getOneUserOrders = async (userId: string, query: OrderSearchModel) => {
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



    reduceAmountFromWallet = async (amount: number) => {
        return await this.Lancer.findOneAndUpdate({}, {
            $inc: { wallet: -amount }
        });
    };

}