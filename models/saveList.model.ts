import { Schema, model, Document } from 'mongoose';
import { SaveListModel } from '../interface';
import { Coll } from '../util';

const saveListSchema: Schema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        saveList: {
            type: [{
                type: Schema.Types.ObjectId,
                ref: "Service"
            }],
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

export const SaveList = model<SaveListModel & Document>('SaveList', saveListSchema, Coll.SAVE_LIST);
