import { z } from "zod";
import { Image, Title, Description } from "./common.validation";

// add categoru body validation
export const AddCategoryBodyVal = z.object({
    title: Title,
    description: Description.optional(),
    image: Image,
});
export type AddCategoryBody = z.infer<typeof AddCategoryBodyVal>;

// edit category body validation
export const EditCategoryBodyVal = z.object({
    title: Title.optional(),
    description: Description.optional(),
    image: Image.optional(),
});
export type EditCategoryBody = z.infer<typeof EditCategoryBodyVal>;
