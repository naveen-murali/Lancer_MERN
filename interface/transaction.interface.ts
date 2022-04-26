import { PaypalRefundStatus, TransactionStatus, TransactionType } from '../util';
import { PaginationModel, PaymentDetailsModel } from './common.interface';
import { OrderModel } from './order.interface';

export interface RefundDetailsModel {
    id: string,
    status: PaypalRefundStatus;
}
export interface WithdrawalDetailsModel {
    price: string,
    account: string;
}

export interface TransactionModel {
    admin: string;
    user: string;
    type: TransactionType;
    price: number;
    status: TransactionStatus;
    withdrawalDetails: WithdrawalDetailsModel;
    order: string | OrderModel;
    orderPaymentDetails: PaymentDetailsModel,
    refundDetails: RefundDetailsModel;
}

export interface TransactionSearchModel extends PaginationModel {
    type: TransactionType;
    status: TransactionStatus;
}
