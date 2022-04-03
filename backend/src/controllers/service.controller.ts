import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { CustomRequest } from '../interface';
import { ServiceService } from '../services';
import { CreateSeviceBody, EditSeviceBody } from '../validation';

interface SearchInter {
    search: string;
    page: string;
    pageSize: string;
    sort: Object;
}

export class ServiceController {

    public categoryService: ServiceService = new ServiceService();


    // @desc        Adding new services
    // @rout        POST /services
    // @acce        User/Seller
    createService = asyncHandler(async (req: CustomRequest, res: Response) => {
        const body: CreateSeviceBody = req.body;
        const userId = req.headers['user']?._id as string;

        const service = await this.categoryService.createService(userId, body);
        res.status(201).json(service);
    });


    // @desc        Get all the services
    // @rout        GET /services
    // @acce        Public
    getServices = asyncHandler(async (req: Request, res: Response) => {
        const query = req.query as unknown as SearchInter;
        const services = await this.categoryService.getServices((query as SearchInter));
        res.status(201).json(services);
    });


    // @desc        Get all the services of a user
    // @rout        GET /services/users
    // @acce        Users[Seller]
    getUsersServices = asyncHandler(async (req: CustomRequest, res: Response) => {
        const query = req.query as unknown as SearchInter;
        const userId = req.headers['user']?._id as string;

        const services = await this.categoryService.getUsersServices(userId, query);
        res.status(201).json(services);
    });


    // @desc        Editing services
    // @rout        PUT /services/:id
    // @acce        User[Seller]
    editService = asyncHandler(async (req: CustomRequest, res: Response) => {
        const serviceData: EditSeviceBody = req.body;
        const serviceId = req.params.id as string;
        const userId = req.headers['user']?._id as string;

        const service = await this.categoryService.editService(serviceId, userId, serviceData);
        res.status(201).json(service);
    });


    // @desc        Getting all services
    // @rout        PUT /services/admin
    // @acce        Admin
    getServicesForAdmin = asyncHandler(async (req: CustomRequest, res: Response) => {
        const query = req.query as unknown as SearchInter;

        const service = await this.categoryService.getServicesForAdmin(query);
        res.status(201).json(service);
    });


    // @desc        Activate service
    // @rout        PATCH /services/:id/acivate
    // @acce        SELLER
    activateService = asyncHandler(async (req: Request, res: Response) => {
        const serviceId = req.params.id as string;
        await this.categoryService.activateService(serviceId);
        res.status(204).json({});
    });


    // @desc        Deactivate service
    // @rout        PATCH /services/:id/deacivate
    // @acce        SELLER
    deactivateService = asyncHandler(async (req: Request, res: Response) => {
        const serviceId = req.params.id as string;
        await this.categoryService.deactivateService(serviceId);
        res.status(204).json({});
    });


    // @desc        Block service
    // @rout        PATCH /services/:id/block
    // @acce        SELLER
    blockService = asyncHandler(async (req: Request, res: Response) => {
        const serviceId = req.params.id as string;
        await this.categoryService.blockService(serviceId);
        res.status(204).json({});
    });


    // @desc        Unblock service
    // @rout        PATCH /services/:id/unblock
    // @acce        SELLER
    unblockService = asyncHandler(async (req: Request, res: Response) => {
        const serviceId = req.params.id as string;
        await this.categoryService.unblockService(serviceId);
        res.status(204).json({});
    });

}