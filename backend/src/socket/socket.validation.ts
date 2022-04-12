import { z } from 'zod';
import { MessageTypes } from '../util';
import { ServiceImage } from '../validation/common.validation';

export const MessageBodyVal = z.object({
    chat: z
        .string({
            invalid_type_error: 'chat should be a string',
            required_error: "chat is required"
        })
        .length(24, {
            message: "chat id should have length of 24"
        }),
    receiver: z
        .string({
            invalid_type_error: 'receiver should be a string',
            required_error: "receiver is required"
        })
        .length(24, {
            message: "receiver id should have length of 24"
        }),
    type: z
        .nativeEnum(MessageTypes).optional(),
    description: z
        .string({
            invalid_type_error: 'description should be a string',
            required_error: "description is required"
        }),
    hasMultiple: z
        .boolean({
            invalid_type_error: 'hasMultiple should be a boolean',
        }).optional(),
    file: ServiceImage.optional(),
    files: z
        .array(ServiceImage).optional(),
    price: z
        .number({
            invalid_type_error: 'price should be a number',
        }).optional(),
    revision: z
        .number({
            invalid_type_error: 'revision should be a number',
        }).optional(),
    deliveryTime: z
        .number({
            invalid_type_error: 'deliveryTime should be a number',
        }).optional()
});
export type MessageBody = z.infer<typeof MessageBodyVal>;


export const OfferBodyVal = z.object({
    chat: z
        .string({
            invalid_type_error: 'chat should be a string',
            required_error: "chat is required"
        })
        .length(24, {
            message: "chat id should have length of 24"
        }),
    message: z
        .string({
            invalid_type_error: 'message should be a string',
            required_error: "message is required"
        })
        .length(24, {
            message: "message id should have length of 24"
        }),
});
export type OfferBody = z.infer<typeof OfferBodyVal>;

export const StatusEventBodyVal = z.object({
    chat: z
        .string({
            invalid_type_error: 'chat should be a string',
            required_error: "chat is required"
        })
        .length(24, {
            message: "chat id should have length of 24"
        }),
    user: z
        .string({
            invalid_type_error: 'user should be a string',
            required_error: "user is required"
        })
        .length(24, {
            message: "user id should have length of 24"
        }),
});
export type StatusEventBody = z.infer<typeof StatusEventBodyVal>;