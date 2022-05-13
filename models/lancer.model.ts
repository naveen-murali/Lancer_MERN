import { Schema, model, Document } from "mongoose";
import { LancerModel } from "../interface";
import { Coll } from "../util";

const lancerSchema: Schema = new Schema(
    {
        wallet: {
            type: Number,
            required: true,
            default: 0,
        },
        commission: {
            type: Number,
            required: true,
            default: 0,
        },
        referralAmount: {
            type: Number,
            required: false,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export const Lancer = model<LancerModel & Document>("Lancer", lancerSchema, Coll.LANCER);
