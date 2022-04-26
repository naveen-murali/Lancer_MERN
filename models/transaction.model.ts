import { Schema, model, Document } from 'mongoose';
import { TransactionModel } from '../interface';
import { Coll, TransactionStatus } from '../util';
import { PaymentDetailsModel } from './common.schema';


const RefundDetailsModel = new Schema(
    {
        id: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        }
    },
    {
        _id: false
    }
);
const WithdrawalDetailsModel = new Schema(
    {
        price: {
            type: Number,
            required: true
        },
        account: {
            type: String,
            required: true
        }
    },
    {
        _id: false
    }
);
export const TransactionsSchema = new Schema(
    {
        admin: {
            type: Schema.Types.ObjectId,
            required: false,
            ref: "Admin"
        },
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        type: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            required: true,
            default: TransactionStatus.PENDING
        },
        withdrawalDetails: {
            type: WithdrawalDetailsModel,
            required: false
        },
        order: {
            type: Schema.Types.ObjectId,
            required: false,
            ref: "Order"
        },
        orderPaymentDetails: {
            type: PaymentDetailsModel,
            required: false
        },
        refundDetails: {
            type: RefundDetailsModel,
            required: false
        }
    },
    {
        timestamps: true
    }
);

export const Transaction = model<TransactionModel & Document>("Transaction", TransactionsSchema, Coll.TRANSACTION);