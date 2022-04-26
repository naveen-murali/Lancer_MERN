import { PaymentPlatform, ServicePackage } from '../util';
import { ServiceModel } from './service.interface';
import { UserModel } from './user.interface';

export interface Image {
    public_id?: string;
    url: string;
}
export interface ServiceImage {
    public_id: string;
    url: string;
}

export type UserType = string | UserModel;
export type ServiceType = string | ServiceModel;

export interface CommonOrderModel {
    buyer: UserType;
    seller: UserType;
    service: ServiceType;
    package: ServicePackage;
}

export interface PaginationModel {
    page: string;
    pageSize: string;
    sort: Object;
}

export interface SearchModel extends PaginationModel {
    search: string;
}

export interface PaymentDetailsModel {
    commission: number;
    platform: PaymentPlatform;
    paymentId: string;
    capturedId: string;
    amount: number;
    createdAt: string;
    updatedAt: string;
}
