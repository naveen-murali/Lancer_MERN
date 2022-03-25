import { Image } from "./common.interface";

export interface CategoryModel {
    admin: string;
    title: string;
    description?: string;
    image: Image;
    isBlocked?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}