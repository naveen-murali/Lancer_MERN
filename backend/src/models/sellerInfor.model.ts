import { Schema, model, Document } from 'mongoose';
import { SellerInfoModel } from '../interface';
import { Coll } from '../util';
import { SkillLevel } from '../util/entities/user.enum';


const certificationsSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        certifiedBy: {
            type: String,
            required: true
        },
        year: {
            type: String,
            required: true
        }
    },
    {
        _id: false
    }
);

const skillsSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        level: {
            type: String,
            required: true
        }
    },
    {
        _id: false
    }
);

const sellerInfoSchema: Schema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        description: {
            type: String,
            required: true
        },
        personalWebsite: {
            type: String,
            required: false
        },
        sellerEarning: {
            type: Number,
            required: true,
            default: 0
        },
        certifications: {
            type: [certificationsSchema],
            required: true
        },
        skills: {
            type: [skillsSchema],
            required: true
        }
    },
    {
        timestamps: true,
    }
);

export const SellerInfo = model<SellerInfoModel & Document>('SellerInfo', sellerInfoSchema, Coll.SELLER_INFO);
