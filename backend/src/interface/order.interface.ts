import { CompletionLevel, OrderSearchType, OrderStatus } from '../util';
import { CommonOrderModel, PaginationModel, PaymentDetailsModel } from './common.interface';

interface CompletionLevelModel {
    seller: CompletionLevel;
    buyer: CompletionLevel;
}
export interface OrderModel extends CommonOrderModel {
    _id: string;
    chat: string;
    status: OrderStatus;
    isNegotiated: boolean;
    price: number;
    deliveryTime: number;
    revision: number;
    remainingRevision: number;
    isPaied: boolean;
    paymentDetails: PaymentDetailsModel;
    completionLevel: CompletionLevelModel;
    createdAt: Date;
    updatedAt: Date;
}


export interface OrderSearchModel extends PaginationModel {
    type: OrderSearchType;
}