import { Schema, model, Document } from "mongoose";
import { MessageModel } from "../interface";
import { Coll, MessageTypes } from "../util";
import { ServiceImage } from "./common.schema";
import { Chat } from "./chat.model";

const MessageSchema = new Schema(
    {
        chat: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Chat",
        },
        sender: {
            type: Schema.Types.ObjectId,
            required: false,
            ref: "User",
        },
        receiver: {
            type: Schema.Types.ObjectId,
            required: false,
            ref: "User",
        },
        type: {
            type: String,
            required: true,
            default: MessageTypes.TEXT,
        },
        description: {
            type: String,
            required: true,
        },
        hasMultiple: {
            type: Boolean,
            required: false,
        },
        file: {
            type: ServiceImage,
            required: false,
            _id: false,
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
            required: false,
        },
        revision: {
            type: Number,
            required: false,
        },
        deliveryTime: {
            type: Number,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

MessageSchema.post("save", function () {
    Chat.findByIdAndUpdate(this.chat, {
        $set: {
            lastMessage: this,
        },
    }).catch((_e) => {});
});

export const Message = model<MessageModel & Document>("Message", MessageSchema, Coll.MESSAGE);
