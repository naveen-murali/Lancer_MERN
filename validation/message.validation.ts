import z from 'zod';
import { ServicePackage } from '../util';

export const CreateRoomBodyVal = z.object({
    seller: z
        .string({
            invalid_type_error: 'seller should be a string',
            required_error: "seller is required"
        })
        .length(24, {
            message: "seller id should have an length of 24"
        }),
    service: z
        .string({
            invalid_type_error: 'service should be a string',
            required_error: "service is required"
        })
        .length(24, {
            message: "service id should have an length of 24"
        }),
    package: z
        .nativeEnum(ServicePackage, {
            required_error: "package is required",
            invalid_type_error: `package can only have values ${ServicePackage.BASIC}, ${ServicePackage.STANDARD} or ${ServicePackage.PREMIUM}`
        })
});
export type CreateRoomBody = z.infer<typeof CreateRoomBodyVal>;