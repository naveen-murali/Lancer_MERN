import { NotFoundException } from '../exceptions';
import { Lancer, User, Order, Service, Chat } from '../models';
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
            User.countDocuments(),
            Order.countDocuments(),
            Service.countDocuments(),
            Chat.countDocuments()
        ]);

        return { totalUsers, totalOrders, totalService, totalChat };
    };


    reduceAmountFromWallet = async (amount: number) => {
        return await this.Lancer.findOneAndUpdate({}, {
            $inc: { wallet: -amount }
        });
    };

}