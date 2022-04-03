import { ServiceImage } from './common.interface';

interface PackagesDetails {
    price: number;
    deliveryTime: number;
    revision: number;
}
interface Packages {
    basic: PackagesDetails,
    standard: PackagesDetails,
    premium: PackagesDetails;
}
export interface ServiceModel {
    user: string;
    title: string;
    description: string;
    category: string;
    subcategory: string;
    images: ServiceImage[];
    packages: Packages;
    rating: number;
    totalReview: number;
    isActive: boolean;
    isBlocked: boolean;
    isDeleted: boolean;
}