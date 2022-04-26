import { Types } from "mongoose";
import cloudinary from 'cloudinary';
import { Coll } from '../util';
import { SearchModel } from '../interface';
import { NotFoundException } from '../exceptions';
import { Category, SubCategory } from '../models';
import {
    AddCategoryBody,
    AddSubCategoryBody,
    EditCategoryBody,
    EditSubCategoryBody
} from '../validation';


export class CategoryService {
    private Category = Category;
    private SubCategory = SubCategory;


    addCategory = async (body: AddCategoryBody, admin: string) => {
        const category = await this.Category.create({
            ...body,
            admin
        });
        return category;
    };


    getAllCategory = async () => {
        return await this.Category.find({ isBlocked: false })
            .select('-isBlocked -admin')
            .sort({ title: 1 })
            .exec();
    };


    getAllCategoryForAdmin = async (query: SearchModel) => {
        const pageSize = Number(query.pageSize) || 10;
        const page = Number(query.page) || 1;

        const keyword = query.search
            ? {
                $or: [
                    {
                        title: {
                            $regex: query.search,
                            $options: 'i'
                        }
                    },
                    {
                        description: {
                            $regex: query.search,
                            $options: 'i'
                        }
                    }
                ]
            }
            : {};

        const count = await this.Category.countDocuments({ ...keyword });
        const category = await this.Category.find({ ...keyword })
            .sort(query.sort || { _id: -1 })
            .limit(pageSize)
            .skip((page - 1) * pageSize);

        return {
            search: query.search,
            category,
            page,
            pageSize,
            pages: Math.ceil(count / pageSize)
        };
    };


    addSubCategory = async (body: AddSubCategoryBody) => {
        if (await Category.exists({ _id: body.category })) {
            const subCat = await this.SubCategory.create({ ...body });

            return subCat;
        }
        else
            throw new NotFoundException('category you provided is not found');
    };


    editSubCategory = async (subcategoryId: string, subcategoryData: EditSubCategoryBody) => {
        const subcategory = await this.SubCategory.findById(subcategoryId);

        if (!subcategory)
            throw new NotFoundException('subcategory not found');

        subcategory.title = subcategoryData.title || subcategory.title;
        subcategory.description = subcategoryData.description || subcategory.description;

        return await subcategory.save();
    };


    getOneSubCategory = async (subcategoryId: string) => {
        const subcategory = await this.SubCategory.findById(subcategoryId);

        if (!subcategory)
            throw new NotFoundException('subcategory not found');

        return subcategory;
    };


    getCategorySubcategory = async (categoryId: string) => {
        return await this.Category.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(categoryId),
                    isBlocked: false
                }
            },
            {
                $lookup: {
                    from: Coll.SUBCATEGORY,
                    let: { category: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$category", "$$category"]
                                },
                                isBlocked: false
                            }
                        },
                        {
                            $project: {
                                category: 0,
                                isBlocked: 0
                            }
                        },
                        {
                            $sort: {
                                title: 1
                            }
                        }
                    ],
                    as: 'subcategory'
                }
            },
            {
                $unset: ['isBlocked', 'admin']
            }
        ]).exec();
    };


    getCategorySubcategoryForAdmin = async (categoryId: string) => {
        return await this.Category.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(categoryId)
                }
            },
            {
                $lookup: {
                    from: Coll.SUBCATEGORY,
                    let: { category: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$category", "$$category"]
                                }
                            }
                        },
                        {
                            $sort: {
                                _id: -1
                            }
                        }
                    ],
                    as: 'subcategory'
                }
            }
        ]).exec();
    };


    editCategory = async (categoryId: string, categoryData: EditCategoryBody) => {
        const category = await this.Category.findById(categoryId);

        if (!category)
            throw new NotFoundException('category not found');

        if (categoryData.image && category.image && category.image.public_id)
            cloudinary.v2.uploader.destroy(category.image.public_id).catch();

        category.title = categoryData.title || category.title;
        category.description = categoryData.description || category.description;
        category.image = categoryData.image || category.image;

        return await category.save();
    };


    blockCategory = async (categoryId: string) => {
        const category = await this.Category.findById(categoryId);

        if (!category)
            throw new NotFoundException('category not found');

        category.isBlocked = true;
        await category.save();

        return true;
    };


    unblockCategory = async (categoryId: string) => {
        const category = await this.Category.findById(categoryId);

        if (!category)
            throw new NotFoundException('category not found');

        category.isBlocked = false;
        await category.save();

        return true;
    };


    blockSubCategory = async (subcategoryId: string) => {
        const subcategory = await this.SubCategory.findById(subcategoryId);

        if (!subcategory)
            throw new NotFoundException('subcategory not found');

        subcategory.isBlocked = true;
        await subcategory.save();

        return true;
    };


    unblockSubCategory = async (subcategoryId: string) => {
        const subcategory = await this.SubCategory.findById(subcategoryId);

        if (!subcategory)
            throw new NotFoundException('subcategory not found');

        subcategory.isBlocked = false;
        await subcategory.save();

        return true;
    };

}