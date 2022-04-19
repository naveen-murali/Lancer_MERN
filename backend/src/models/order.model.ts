import { Schema, model, Document } from 'mongoose';
import { OrderModel } from '../interface';
import { Coll, CompletionLevel, OrderStatus } from '../util';
import { PaymentDetailsModel } from './common.schema';


const CompletionLevelModel = new Schema(
    {
        seller: {
            type: String,
            required: true,
            default: CompletionLevel.ONGOING
        },
        buyer: {
            type: String,
            required: true,
            default: CompletionLevel.ONGOING
        },
    },
    {
        _id: false
    }
);

export const OrdersSchema = new Schema(
    {
        chat: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Chat",
        },
        buyer: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        seller: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        service: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Service"
        },
        package: {
            type: String,
            required: true,
        },
        isNegotiated: {
            type: Boolean,
            required: true,
            default: false
        },
        price: {
            type: Number,
            required: true
        },
        deliveryTime: {
            type: Number,
            required: true
        },
        revision: {
            type: Number,
            required: true
        },
        remainingRevision: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            required: true,
            default: OrderStatus.ONGOING
        },
        completionLevel: {
            type: CompletionLevelModel,
            required: true,
            default: {}
        },
        isPaied: {
            type: Boolean,
            required: true,
            default: false
        },
        paymentDetails: {
            type: PaymentDetailsModel,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Order = model<OrderModel & Document>("Order", OrdersSchema, Coll.ORDER);