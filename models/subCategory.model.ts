import { Schema, model } from 'mongoose';
import { SubCategoryModel } from '../interface';
import { Coll } from '../util';

const subCategorySchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    isBlocked: {
        type: Boolean,
        required: true,
        default: false
    }
});

export const SubCategory = model<SubCategoryModel & Document>('Subcategory', subCategorySchema, Coll.SUBCATEGORY);