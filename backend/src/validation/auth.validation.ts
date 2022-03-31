import { z } from 'zod';
import {
    Email,
    Name,
    Phone,
    Otp,
    Id,
    Password,
    ReferralId
} from './common.validation';



// signup body validation
export const SignupBodyVal = z.object({
    name: Name,
    email: Email,
    phone: Phone,
    referralId: ReferralId,
    otp: Otp
});
export type SignupBody = z.infer<typeof SignupBodyVal>;


// signup google validation
export const SignupGooogleBodyVal = z.object({
    tokenId: Id
});
export type SignupGooogleBody = z.infer<typeof SignupGooogleBodyVal>;



// signin body validation
export const SigninBodyVal = z.object({
    email: Email,
    password: Password
});
export type SigninBody = z.infer<typeof SigninBodyVal>;



// signin with body validation
export const SigninGoogleBodyVal = z.object({
    googleId: Id,
});
export type SigninGoogleBody = z.infer<typeof SigninGoogleBodyVal>;



// signin admin body validation
export const SigninAdminBodyVal = z.object({
    email: Email,
    password: Password
});
export type SigninAdminBody = z.infer<typeof SigninAdminBodyVal>;



// otp body validation
export const SendOtpBodyVal = z.object({
    phone: Phone
});
export type SendOtpBody = z.infer<typeof SendOtpBodyVal>;
