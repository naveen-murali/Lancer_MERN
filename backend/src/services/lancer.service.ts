import { Lancer } from '../models';

export class LancerService {
    private Lancer = Lancer;


    getLancer = async () => {
        return await this.Lancer.findOne();
    };


    reduceAmountFromWallet = async (amount: number) => {
        return await this.Lancer.findOneAndUpdate({}, {
            $inc: { wallet: -amount }
        });
    };

}