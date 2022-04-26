import { Schema, model, Document } from 'mongoose';
import { Coll } from '../util';
import { ChatModel } from '../interface';
import { packageDetailsSchema } from './service.model';

const orderSchema = new Schema(
    {
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
    },
    {
        _id: false
    }
);
const ChatSchema = new Schema(
    {
        members: {
            type: [{
                type: Schema.Types.ObjectId,
                required: false,
                ref: "User",
            }],
            length: 2,
            required: true,
        },
        order: {
            type: orderSchema,
            required: true
        },
        package: {
            type: packageDetailsSchema,
            required: true
        },
        isOrdered: {
            type: Boolean,
            required: true,
            default: false
        },
        isNegotiated: {
            type: Boolean,
            required: true,
            default: false
        },
        negotiatedPrice: {
            type: Number,
            default: 0
        },
        negotiatedRevision: {
            type: Number,
            default: 0
        },
        negotiatedDeliveryTime: {
            type: Number,
            default: 0
        },
        isBlocked: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

export const Chat = model<ChatModel & Document>('Chat', ChatSchema, Coll.CHAT);