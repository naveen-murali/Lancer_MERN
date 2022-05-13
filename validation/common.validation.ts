import { z } from "zod";
import { BadRequestException } from "../exceptions";
import { EmailPattern, RefEnum, SkillLevel } from "../util";

export const Name = z
    .string({
        invalid_type_error: "name should be a string",
        required_error: "name is required",
    })
    .min(6, {
        message: "name should have min-length of 6",
    });

export const Email = z
    .string({
        invalid_type_error: "email should be a string",
        required_error: "email is required",
    })
    .regex(EmailPattern, {
        message: "invalied email",
    });

export const Phone = z
    .string({
        invalid_type_error: "phone should be a string",
        required_error: "phone is required",
    })
    .length(10, {
        message: "please enter a valied phone number",
    });

export const Otp = z
    .string({
        invalid_type_error: "otp should be a string",
        required_error: "otp is required",
    })
    .length(4, {
        message: "please enter valied otp",
    });

export const Password = z
    .string({
        invalid_type_error: "password should be a string",
        required_error: "password is required",
    });

export const ReferralId = z
    .string()
    .length(RefEnum.LENGTH, {
        message: `referral id length should be ${RefEnum.LENGTH}`,
    })
    .optional();

export const Id = z.string({
    invalid_type_error: "id should be a string",
    required_error: "id is required",
});

export const Image = z.object({
    public_id: z
        .string({
            invalid_type_error: "public id should be a string",
        })
        .optional(),
    url: z.string({
        invalid_type_error: "url id should be a string",
        required_error: "url id is required",
    }),
});

export const ServiceImage = z
    .object({
        public_id: z.string({
            invalid_type_error: "public id should be a string",
        }),
        url: z.string({
            invalid_type_error: "url id should be a string",
            required_error: "url id is required",
        }),
    });

export const Title = z
    .string({
        invalid_type_error: "title should be a string",
        required_error: "title is required",
    });

export const Description = z
    .string({
        invalid_type_error: "description should be a string",
        required_error: "description is required",
    });

export const Category = z
    .string({
        invalid_type_error: "category should be a string",
        required_error: "category is required",
    })
    .length(24, {
        message: "category id should have length of 24",
    });

export const Subcategory = z
    .string({
        invalid_type_error: "subcategory should be a string",
        required_error: "subcategory is required",
    })
    .length(24, {
        message: "subcategory id should have length of 24",
    });

export const PersonalWebsite = z
    .string({
        invalid_type_error: "personalWebsite should be a string",
        required_error: "personalWebsite is required",
    })
    .optional();

export const Certification = z
    .object({
        title: Title,
        certifiedBy: z.string({
            invalid_type_error: "certifiedBy should be a string",
            required_error: "certifiedBy is required",
        }),
        year: z.string({
            invalid_type_error: "year should be a string",
            required_error: "year is required",
        }),
    });

export const Skill = z.object({
    title: Title,
    level: z.
        nativeEnum(SkillLevel, {
            invalid_type_error: `level can only have a value of ${SkillLevel.BIGGINER}, ${SkillLevel.INERMEDIATE} or ${SkillLevel.EXPERT}`,
            required_error: "level should be a string",
        }),
});

export const PackagesDetails = z.object({
    price: z
        .number({
            required_error: "price required",
            invalid_type_error: "price should be a number",
        }),
    deliveryTime: z
        .number({
            required_error: "delivery time required",
            invalid_type_error: "delivery time should be a number",
        }),
    revision: z
        .number({
            required_error: "revision required",
            invalid_type_error: "revision should be a number",
        }),
});

export const Packages = z.object(
    {
        basic: PackagesDetails,
        standard: PackagesDetails,
        premium: PackagesDetails,
    },
    {
        invalid_type_error: "packages should be an object consists of basic, standard and premium",
    }
);

export const Chat = z
    .string({
        invalid_type_error: "chat should be a string",
        required_error: "chat is required",
    })
    .length(24, {
        message: "chat id should have length of 24",
    });

export const validateEnum = (enums: any, data: any) => {
    const EnumBodyVal = z.nativeEnum(enums);
    const retundata = EnumBodyVal.safeParse(data);

    if (!retundata.success) {
        console.log("--------------IN validate body middleware [not success]--------------");
        const errors: string[] = retundata.error.issues.map((msg) => msg.message);
        throw new BadRequestException(errors, "Invalide Credentials");
    }

    return true;
};
