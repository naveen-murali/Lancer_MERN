import { Schema, model } from 'mongoose';
import { CategoryModel } from '../interface';
import { Coll } from '../util';
import { Image } from './common.schema';

const categorySchema = new Schema({
    admin: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Admin"
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: Image,
        required: true
    },
    isBlocked: {
        type: Boolean,
        required: true,
        default: false
    }
});

export const Category = model<CategoryModel & Document>('Category', categorySchema, Coll.CATEGORY);