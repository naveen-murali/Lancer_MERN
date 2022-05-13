import { Schema, model } from "mongoose";
import { Coll } from "../util";
import { Image } from "./common.schema";
import { CategoryModel } from "../interface";

const CategorySchema = new Schema({
    admin: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Admin",
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    image: {
        type: Image,
        required: true,
    },
    isBlocked: {
        type: Boolean,
        required: true,
        default: false,
    },
});

export const Category = model<CategoryModel & Document>("Category", CategorySchema, Coll.CATEGORY);
