import { Schema, model, Document } from "mongoose";
import { ReviewModel } from "../interface";
import { Coll } from "../util";

const reviewsSchema: Schema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        rating: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
    {
        _id: false,
        timestamps: true,
    }
);
const reviewSchema: Schema = new Schema(
    {
        service: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        reviews: {
            type: [reviewsSchema],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Review = model<ReviewModel & Document>("Review", reviewSchema, Coll.REVIEWS);
