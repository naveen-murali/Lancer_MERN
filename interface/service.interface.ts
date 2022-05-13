import { SearchModel, ServiceImage } from "./common.interface";

export interface ServiceSearchModal extends SearchModel {
    category: string;
    subcategory: string;
}

export interface PackagesDetails {
    price: number;
    deliveryTime: number;
    revision: number;
}
interface PackagesModel {
    basic: PackagesDetails;
    standard: PackagesDetails;
    premium: PackagesDetails;
}
export interface ServiceModel {
    user: string;
    title: string;
    description: string;
    category: string;
    subcategory: string;
    images: ServiceImage[];
    packages: PackagesModel;
    rating: number;
    totalReview: number;
    isActive: boolean;
    isBlocked: boolean;
    isDeleted: boolean;
}
