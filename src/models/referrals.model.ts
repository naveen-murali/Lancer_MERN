import { Schema, model, Document } from 'mongoose';
import { ReferralsModel } from '../interface';


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
    { timestamps: true }
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

export const Referrals = model<ReferralsModel & Document>('Referrals', referralSchema);
