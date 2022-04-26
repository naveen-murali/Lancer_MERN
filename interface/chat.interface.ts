import { CommonOrderModel, UserType } from './common.interface';
import { PackagesDetails } from './service.interface';

export interface ChatModel {
    _id: string;
    members: [UserType, UserType];
    order: CommonOrderModel;
    package: PackagesDetails;
    isOrdered: boolean;
    isNegotiated: boolean;
    negotiatedPrice: number;
    negotiatedRevision: number;
    negotiatedDeliveryTime: number;
    isBlocked: boolean;
    createdAt: Date;
    updatedAt: Date;
}