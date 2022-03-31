import { Role, SkillLevel } from "../util";
import { Image } from "./common.interface";

interface CertificationsInter {
    title: string;
    certifiedBy: string;
    year: string;
}
interface SkillsInter {
    title: string;
    level: SkillLevel;
}
export interface SellerInfoModel {
    _id: string;
    user: string;
    description: string;
    personalWebsite?: string;
    sellerEarning: number;
    certifications: CertificationsInter[];
    skills: SkillsInter[];
    createdAt?: Date;
    updatedAt?: Date;
}

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
    widrowWallet: number;
    referralId: string;
    referralNum: Number;
    isBlocked?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    matchPassword(enteredPassword: string): Promise<boolean>;
}
