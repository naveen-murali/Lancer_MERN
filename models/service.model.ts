import { Schema, model, Document } from 'mongoose';
import { ServiceModel } from '../interface';
import { ServiceImage } from './common.schema';
import { Coll } from '../util';


export const packageDetailsSchema: Schema = new Schema(
    {
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
        }
    },
    {
        _id: false
    }
);

const packagesSchema: Schema = new Schema(
    {
        basic: {
            type: packageDetailsSchema,
            required: true,
        },
        standard: {
            type: packageDetailsSchema,
            required: true,
        },
        premium: {
            type: packageDetailsSchema,
            required: true,
        },
    },
    {
        _id: false
    }
);


const serviceSchema: Schema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Category"
        },
        subcategory: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Subcategory"
        },
        images: {
            type: [ServiceImage],
            required: true
        },
        packages: {
            type: packagesSchema,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            default: 0
        },
        totalReview: {
            type: Number,
            required: true,
            default: 0
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true
        },
        isBlocked: {
            type: Boolean,
            required: true,
            default: false
        },
        isDeleted: {
            type: Boolean,
            required: true,
            default: false
        },
    },
    {
        timestamps: true,
    }
);

export const Service = model<ServiceModel & Document>('Service', serviceSchema, Coll.SERVICES);
