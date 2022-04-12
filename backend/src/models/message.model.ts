import { Schema, model, Document } from 'mongoose';
import { MessageModel } from '../interface';
import { Coll, MessageTypes } from '../util';
import { ServiceImage } from './common.schema';

const MessageSchema = new Schema(
    {
        chat: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Chat'
        },
        sender: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        receiver: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        type: {
            type: String,
            required: true,
            default: MessageTypes.TEXT
        },
        description: {
            type: String,
            required: true
        },
        hasMultiple: {
            type: Boolean,
            required: false
        },
        file: {
            type: ServiceImage,
            required: false,
            _id: false
        },
        files: {
            type: [ServiceImage],
            required: false,
            default: undefined,
        },
        acceptStatus: {
            type: String,
            required: false,
        },
        price: {
            type: Number,
            required: false
        },
        revision: {
            type: Number,
            required: false
        },
        deliveryTime: {
            type: Number,
            required: false
        }
    },
    {
        timestamps: true
    }
);

export const Message = model<MessageModel & Document>('Message', MessageSchema, Coll.MESSAGE);