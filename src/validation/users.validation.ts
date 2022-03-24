import { z } from 'zod';

export const UsersValidation = z.number({ invalid_type_error: "is not a number" });

export type UsersInterface = z.infer<typeof UsersValidation>;