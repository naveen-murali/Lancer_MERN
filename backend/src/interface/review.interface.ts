import { Types } from "mongoose";
import { Image } from './common.interface';

interface ReviewsModel {
    user: string | Types.ObjectId;
    rating: number;
    description: string;
}
export interface ReviewModel {
    _id: string;
    service: string,
    reviews: ReviewsModel[];
    createdAt: Date;
    updatedAt: Date;
}