import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { CustomRequest, SearchModel } from "../interface";
import { CategoryService } from "../services";
import {
    AddCategoryBody,
    AddSubCategoryBody,
    EditCategoryBody,
    EditSubCategoryBody,
} from "../validation";

export class CategoryController {
    public categoryService: CategoryService = new CategoryService();

    // @desc        Adding new category
    // @rout        POST /category
    // @acce        Admin
    addCategory = asyncHandler(async (req: CustomRequest, res: Response) => {
        const body: AddCategoryBody = req.body;
        const adminId = req.headers["user"]?._id as string;

        const category = await this.categoryService.addCategory(body, adminId);
        res.status(201).json(category);
    });

    // @desc        For geting all category
    // @rout        GET /category
    // @acce        Public
    getAllCategory = asyncHandler(async (req: Request, res: Response) => {
        const category = await this.categoryService.getAllCategory();
        res.json(category);
    });

    // @desc        For geting all category for admin
    // @rout        GET /category/admin
    // @acce        Admin
    getAllCategoryForAdmin = asyncHandler(async (req: Request, res: Response) => {
        const query = req.query as unknown as SearchModel;

        const category = await this.categoryService.getAllCategoryForAdmin(query);
        res.json(category);
    });

    // @desc        Adding new sub category
    // @rout        POST /category/subcategory
    // @acce        Admin
    addSubCategory = asyncHandler(async (req: Request, res: Response) => {
        const body: AddSubCategoryBody = req.body;

        const category = await this.categoryService.addSubCategory(body);
        res.status(201).json(category);
    });

    // @desc        Editing new sub category
    // @rout        PUT /category/subcategory/:id
    // @acce        Admin
    editSubCategory = asyncHandler(async (req: Request, res: Response) => {
        const subcategoryId = req.params.id as string;
        const subcategory: EditSubCategoryBody = req.body;

        const category = await this.categoryService.editSubCategory(subcategoryId, subcategory);
        res.json(category);
    });

    // @desc        Getting one sub category
    // @rout        GET /category/subcategory/:id
    // @acce        Admin
    getOneSubCategory = asyncHandler(async (req: Request, res: Response) => {
        const subcategoryId = req.params.id as string;

        const category = await this.categoryService.getOneSubCategory(subcategoryId);
        res.json(category);
    });

    // @desc        For geting category details and curresponding subcategory
    // @rout        GET /category/:id
    // @acce        Public
    getCategorySubcategory = asyncHandler(async (req: Request, res: Response) => {
        const categoryId = req.params.id as string;

        const category = await this.categoryService.getCategorySubcategory(categoryId);
        res.json(category[0]);
    });

    // @desc        For geting category details and curresponding subcategory
    // @rout        GET /category/admin/:id
    // @acce        Admin
    getCategorySubcategoryForAdmin = asyncHandler(async (req: Request, res: Response) => {
        const categoryId = req.params.id as string;

        const category = await this.categoryService.getCategorySubcategoryForAdmin(categoryId);
        res.json(category[0]);
    });

    // @desc        For blocking the category
    // @rout        PUT /category/:id
    // @acce        Admin
    editCategory = asyncHandler(async (req: Request, res: Response) => {
        const categoryId = req.params.id as string;
        const category: EditCategoryBody = req.body;

        const updatedCat = await this.categoryService.editCategory(categoryId, category);
        res.json(updatedCat);
    });

    // @desc        For blocking the category
    // @rout        PATCH /category/block/:id
    // @acce        Admin
    blockCategory = asyncHandler(async (req: Request, res: Response) => {
        const categoryId = req.params.id as string;

        await this.categoryService.blockCategory(categoryId);
        res.status(204).json({});
    });

    // @desc        For unblocking the subcategory
    // @rout        PATCH /category/unblock/:id
    // @acce        Admin
    unblockCategory = asyncHandler(async (req: Request, res: Response) => {
        const categoryId = req.params.id as string;

        await this.categoryService.unblockCategory(categoryId);
        res.status(204).json({});
    });

    // @desc        For blocking the subcategory
    // @rout        PATCH /category/subcategory/block/:id
    // @acce        Admin
    blockSubCategory = asyncHandler(async (req: Request, res: Response) => {
        const subcategoryId = req.params.id as string;

        await this.categoryService.blockSubCategory(subcategoryId);
        res.status(204).json({});
    });

    // @desc        For unblocking the sucategory
    // @rout        PATCH /category/subcategory/unblock/:id
    // @acce        Admin
    unblockSubCategory = asyncHandler(async (req: Request, res: Response) => {
        const subcategoryId = req.params.id as string;

        await this.categoryService.unblockSubCategory(subcategoryId);
        res.status(204).json({});
    });
}
