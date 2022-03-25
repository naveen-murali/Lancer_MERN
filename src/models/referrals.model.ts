import { Schema, model, Document } from 'mongoose';
import { ReferralsModel } from '../interface';
import { Coll } from '../util';


const referralsSchema: Schema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        amount: {
            type: Number,
            required: true
        }
    },
    {
        _id: false,
        timestamps: true
    }
);

const referralSchema: Schema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        referrals: [referralsSchema]
    },
    {
        timestamps: true,
    }
);

export const Referrals = model<ReferralsModel & Document>('Referrals', referralSchema, Coll.REFERRAL);
