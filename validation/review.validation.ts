import { z } from 'zod';
import { Description } from './common.validation';

export const AddReviewBodyVal = z.object({
    description: Description,
    rating: z
        .number({
            invalid_type_error: "rating should be a number",
            required_error: "rating is required"
        })
});
export type AddReviewBody = z.infer<typeof AddReviewBodyVal>;