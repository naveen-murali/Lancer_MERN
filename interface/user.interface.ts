import { Role, SkillLevel } from "../util";
import { Image } from "./common.interface";

export interface UserModel {
    _id?: string;
    name: string;
    email: string;
    phone?: string;
    isEmailVarified?: boolean;
    isPhoneVerified?: boolean;
    googleId?: string;
    password?: string;
    image?: Image;
    role: Role[];
    wallet: number;
    withdrawedWallet: number;
    referralId: string;
    referralNum: Number;
    isBlocked?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    matchPassword(enteredPassword: string): Promise<boolean>;
}

interface CertificationsModel {
    title: string;
    certifiedBy: string;
    year: string;
}
interface SkillsModel {
    title: string;
    level: SkillLevel;
}
export interface SellerInfoModel {
    _id: string;
    user: string | UserModel;
    description: string;
    personalWebsite?: string;
    sellerEarning: number;
    certifications: CertificationsModel[];
    skills: SkillsModel[];
    createdAt?: Date;
    updatedAt?: Date;
}