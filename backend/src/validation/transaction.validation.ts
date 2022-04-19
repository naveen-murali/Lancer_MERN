import { z } from 'zod';
import { BadRequestException } from '../exceptions';
import { ValidationMiddleware } from '../interface';
import { TransactionStatus, TransactionType } from '../util';
import { Chat } from './common.validation';

// for creating a trasaction in paypal
export const CreatePaypalPaymentBodyVal = z.object({
    chat: Chat
});
export type CreatePaypalPaymentBody = z.infer<typeof CreatePaypalPaymentBodyVal>;


// for creating a withdrawal request
export const CreateWithdrawalRequestBodyVal = z.object({
    amount: z
        .number({
            required_error: "amount is required",
            invalid_type_error: "amount should be a number"
        }),
    account: z
        .string({
            required_error: "account is required",
            invalid_type_error: "account should be a string"
        })
});
export type CreateWithdrawalRequestBody = z.infer<typeof CreateWithdrawalRequestBodyVal>;


export const validateEnum = (enums: any, data: any) => {
    const EnumBodyVal = z.nativeEnum(enums);
    const retundata = EnumBodyVal.safeParse(data);

    if (!retundata.success) {
        console.log('--------------IN validate body middleware [not success]--------------');
        const errors: string[] = retundata.error.issues.map(msg => msg.message);
        throw new BadRequestException("Invalide Credentials", errors);
    }

    return true;
};