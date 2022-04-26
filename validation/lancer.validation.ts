import z from "zod";

export const UpdateLancerBodyVal = z.object({
    referralAmount: z
        .number({
            invalid_type_error: "referralAmount should be a number"
        })
        .min(50, {
            message: "minimum referrel amount should be 50"
        })
        .optional(),
    commission: z
        .number({
            invalid_type_error: "commission should be a number"
        })
        .min(5, {
            message: "minimum commission should be 5 percentage"
        })
        .optional()
});
export type UpdateLancerBody = z.infer<typeof UpdateLancerBodyVal>; 