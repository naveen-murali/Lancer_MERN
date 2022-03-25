import { z } from 'zod';
import { EmailPattern, RefEnum } from '../util';

export const Name = z
    .string({
        invalid_type_error: 'name should be a string',
        required_error: "name is required"
    })
    .min(6, {
        message: 'name should have min-length of 6'
    });

export const Email = z
    .string({
        invalid_type_error: 'email should be a string',
        required_error: "email is required"
    })
    .regex(EmailPattern, {
        message: "invalied email"
    });

export const Phone = z
    .string({
        invalid_type_error: 'phone should be a string',
        required_error: "phone is required"
    })
    .length(10, {
        message: "please enter a valied phone number"
    });

export const Otp = z
    .string({
        invalid_type_error: 'otp should be a string',
        required_error: "otp is required"
    })
    .length(4, {
        message: "please enter valied otp"
    });

export const Password = z
    .string({
        invalid_type_error: 'password should be a string',
        required_error: "password is required"
    });

export const ReferralId = z
    .string()
    .length(RefEnum.LENGTH, {
        message: `referral id length should be ${RefEnum.LENGTH}`
    })
    .optional();

export const Id = z
    .string({
        invalid_type_error: 'id should be a string',
        required_error: "id is required"
    });

export const Image = z
    .object({
        public_id: z
            .string({
                invalid_type_error: 'public id should be a string',
                required_error: "public id is required"
            })
            .optional(),
        url: z
            .string({
                invalid_type_error: 'url id should be a string',
                required_error: "url id is required"
            })
    });


export const Title = z
    .string({
        invalid_type_error: 'title should be a string',
        required_error: "title is required"
    });


export const Description = z
    .string({
        invalid_type_error: 'description should be a string',
        required_error: "description is required"
    });

export const Category = z
    .string({
        invalid_type_error: 'category should be a string',
        required_error: "category is required"
    })
    .length(24, {
        message: "category id should have length of 24"
    });