import { ServicePackage } from '../util';
import { PackagesDetails, ServiceModel } from './service.interface';
import { UserModel } from './user.interface';

interface OrderInterface {
    buyer: string | UserModel;
    seller: string | UserModel;
    service: string | ServiceModel;
    package: ServicePackage;
}

type MemberType = string | UserModel;

export interface ChatModel {
    _id: string;
    members: [MemberType, MemberType];
    order: OrderInterface;
    package: PackagesDetails;
    isOrdered: boolean;
    isNegotiated: boolean;
    negotiatedPrice: Number;
    negotiatedRevision: Number;
    negotiatedDeliveryTime: Number;
    isBlocked: boolean;
    createdAt: Date;
    updatedAt: Date;
}