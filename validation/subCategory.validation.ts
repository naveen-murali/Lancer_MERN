import { z } from "zod";
import { Title, Description, Category } from "./common.validation";

export const AddSubCategoryBodyVal = z.object({
    category: Category,
    title: Title,
    description: Description.optional(),
});
export type AddSubCategoryBody = z.infer<typeof AddSubCategoryBodyVal>;

export const EditSubCategoryBodyVal = z.object({
    title: Title.optional(),
    description: Description.optional(),
});
export type EditSubCategoryBody = z.infer<typeof EditSubCategoryBodyVal>;
