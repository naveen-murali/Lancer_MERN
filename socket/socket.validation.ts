import { z } from "zod";
import { MessageTypes, PaymentPlatform } from "../util";
import { Email, ServiceImage, Chat } from "../validation/common.validation";

const Message = z
    .string({
        invalid_type_error: "message should be a string",
        required_error: "message is required",
    })
    .length(24, {
        message: "message id should have length of 24",
    });

export const MessageBodyVal = z.object({
    chat: Chat,
    receiver: z
        .string({
            invalid_type_error: "receiver should be a string",
            required_error: "receiver is required",
        })
        .length(24, {
            message: "receiver id should have length of 24",
        }),
    type: z
        .nativeEnum(MessageTypes).optional(),
    description: z
        .string({
            invalid_type_error: "description should be a string",
            required_error: "description is required",
        }),
    hasMultiple: z
        .boolean({
            invalid_type_error: "hasMultiple should be a boolean",
        })
        .optional(),
    file: ServiceImage.optional(),
    files: z.array(ServiceImage).optional(),
    price: z
        .number({
            invalid_type_error: "price should be a number",
        })
        .optional(),
    revision: z
        .number({
            invalid_type_error: "revision should be a number",
        })
        .optional(),
    deliveryTime: z
        .number({
            invalid_type_error: "deliveryTime should be a number",
        })
        .optional(),
});
export type MessageBody = z.infer<typeof MessageBodyVal>;

export const OfferBodyVal = z.object({
    chat: Chat,
    message: Message,
});
export type OfferBody = z.infer<typeof OfferBodyVal>;

export const StatusEventBodyVal = z.object({
    chat: Chat,
    user: z
        .string({
            invalid_type_error: "user should be a string",
            required_error: "user is required",
        })
        .length(24, {
            message: "user id should have length of 24",
        }),
});
export type StatusEventBody = z.infer<typeof StatusEventBodyVal>;

export const PaymentDetails = z.object({
    token: z.string({
        invalid_type_error: "token should be a string",
        required_error: "token is required",
    }),
    PayerID: z.string({
        invalid_type_error: "PayerID should be a string",
        required_error: "PayerID is required",
    }),
    paymentId: z.string({
        invalid_type_error: "paymentId should be a string",
        required_error: "paymentId is required",
    }),
});
export type PaymentDetailsBody = z.infer<typeof PaymentDetails>;
export const PlaceOrderBodyVal = z.object({
    chat: Chat,
    message: Message,
    platform: z.nativeEnum(PaymentPlatform),
    paymentDetails: PaymentDetails,
});
export type PlaceOrderBody = z.infer<typeof PlaceOrderBodyVal>;
