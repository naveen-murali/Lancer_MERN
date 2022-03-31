import { z } from 'zod';
import { Certification, Description, PersonalWebsite, Skill } from './common.validation';

export const UsersValidation = z.number({ invalid_type_error: "is not a number" });

export type UsersInterface = z.infer<typeof UsersValidation>;

export const AddSellerInfoBodyVal = z.object({
    description: Description,
    personalWebsite: PersonalWebsite,
    certifications: z
        .array(Certification, {
            required_error: "certifications is required",
            invalid_type_error: "certifications should be an array"
        }).optional(),
    skills: z
        .array(Skill, {
            required_error: "skills is required",
            invalid_type_error: "skills should be an array"
        })
});
export type AddSellerInfoBody = z.infer<typeof AddSellerInfoBodyVal>;