import { Role } from "../util";
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
    referralId: string;
    referralNum: Number;
    isBlocked?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    matchPassword(enteredPassword: string): Promise<boolean>;
}
