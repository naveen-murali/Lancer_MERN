import { z } from 'zod';
import { Category, Description, Image, Packages, ServiceImage, Subcategory, Title } from './common.validation';


// create service model
export const CreateSeviceBodyVal = z.object({
    title: Title,
    description: Description,
    category: Category,
    subcategory: Subcategory,
    images: z.array(
        Image,
        {
            invalid_type_error: "images should be an array"
        }),
    packages: Packages
});
export type CreateSeviceBody = z.infer<typeof CreateSeviceBodyVal>;


// create service model
export const EditSeviceBodyVal = z.object({
    title: Title.optional(),
    description: Description.optional(),
    category: Category.optional(),
    subcategory: Subcategory.optional(),
    images: z.
        array(ServiceImage,
            {
                invalid_type_error: "images should be an array"
            }
        ).optional(),
    packages: Packages.optional()
});
export type EditSeviceBody = z.infer<typeof EditSeviceBodyVal>; 
