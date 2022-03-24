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
    .string({
        invalid_type_error: 'image should be a string',
        required_error: "image is required"
    });;