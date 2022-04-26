import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { ServiceService } from '../services';
import { CustomRequest, ServiceSearchModal, UserModel } from '../interface';
import { AddReviewBody, AddSaveListBody, CreateSeviceBody, EditSeviceBody } from '../validation';

export class ServiceController {

    public serviceService: ServiceService = new ServiceService();


    // @desc        Adding new services
    // @rout        POST /services
    // @acce        User/Seller
    createService = asyncHandler(async (req: CustomRequest, res: Response) => {
        const body: CreateSeviceBody = req.body;
        const userId = req.headers['user']?._id as string;

        const service = await this.serviceService.createService(userId, body);
        res.status(201).json(service);
    });


    // @desc        Get all the services
    // @rout        GET /services
    // @acce        Public
    getServices = asyncHandler(async (req: Request, res: Response) => {
        const query = req.query as unknown as ServiceSearchModal;
        const services = await this.serviceService.getServices((query as ServiceSearchModal));
        res.json(services);
    });


    // @desc        Get all the services of a user
    // @rout        GET /services/users
    // @acce        Users[Seller]
    getUsersServices = asyncHandler(async (req: CustomRequest, res: Response) => {
        const query = req.query as unknown as ServiceSearchModal;
        const userId = req.headers['user']?._id as string;

        const services = await this.serviceService.getUsersServices(userId, query);
        res.json(services);
    });


    // @desc        Get one service
    // @rout        GET /services/:id
    // @acce        Users[Buyer]
    getOneService = asyncHandler(async (req: CustomRequest, res: Response) => {
        const serviceId = req.params.id;

        const service = await this.serviceService.getOneService(serviceId);
        res.json(service);
    });


    // @desc        Editing services
    // @rout        PUT /services/:id
    // @acce        User[Seller]
    editService = asyncHandler(async (req: CustomRequest, res: Response) => {
        const serviceData: EditSeviceBody = req.body;
        const serviceId = req.params.id as string;
        const userId = req.headers['user']?._id as string;

        const service = await this.serviceService.editService(serviceId, userId, serviceData);
        res.status(201).json(service);
    });


    // @desc        Getting all services
    // @rout        PUT /services/admin
    // @acce        Admin
    getServicesForAdmin = asyncHandler(async (req: CustomRequest, res: Response) => {
        const query = req.query as unknown as ServiceSearchModal;

        const service = await this.serviceService.getServicesForAdmin(query);
        res.json(service);
    });


    // @desc        Getting one service for admin
    // @rout        GET /services/:id/admin
    // @acce        Admin
    getOneServiceForAdmin = asyncHandler(async (req: CustomRequest, res: Response) => {
        const serviceId = req.params.id as string;

        const service = await this.serviceService.getOneServiceForAdmin(serviceId);
        res.json(service);
    });


    // @desc        Activate service
    // @rout        PATCH /services/:id/acivate
    // @acce        SELLER
    activateService = asyncHandler(async (req: Request, res: Response) => {
        const serviceId = req.params.id as string;
        await this.serviceService.activateService(serviceId);
        res.status(204).json({});
    });


    // @desc        Deactivate service
    // @rout        PATCH /services/:id/deacivate
    // @acce        SELLER
    deactivateService = asyncHandler(async (req: Request, res: Response) => {
        const serviceId = req.params.id as string;
        await this.serviceService.deactivateService(serviceId);
        res.status(204).json({});
    });


    // @desc        Block service
    // @rout        PATCH /services/:id/block
    // @acce        Admin
    blockService = asyncHandler(async (req: Request, res: Response) => {
        const serviceId = req.params.id as string;
        await this.serviceService.blockService(serviceId);
        res.status(204).json({});
    });


    // @desc        Unblock service
    // @rout        PATCH /services/:id/unblock
    // @acce        Admin
    unblockService = asyncHandler(async (req: Request, res: Response) => {
        const serviceId = req.params.id as string;
        await this.serviceService.unblockService(serviceId);
        res.status(204).json({});
    });


    // @desc        Geting SaveLists
    // @rout        PATCH /services/save-list
    // @acce        Users
    getSaveList = asyncHandler(async (req: CustomRequest, res: Response) => {
        const userId = (req.headers['user'] as UserModel)._id as string;

        const saveList = await this.serviceService.getSaveList(userId);
        res.json(saveList);
    });


    // @desc        Setting service in SaveList
    // @rout        POST /services/save-list
    // @acce        Users
    setSaveList = asyncHandler(async (req: CustomRequest, res: Response) => {
        const serviceId = (req.body as AddSaveListBody).serviceId;
        const userId = (req.headers['user'] as UserModel)._id as string;

        await this.serviceService.setSaveList(userId, serviceId);
        res.status(204).json({});
    });


    // @desc        Setting service in SaveList
    // @rout        PATCH /services/save-list/:id
    // @acce        Users
    deleteSaveList = asyncHandler(async (req: CustomRequest, res: Response) => {
        const serviceId = req.params.id as string;
        const userId = (req.headers['user'] as UserModel)._id as string;

        await this.serviceService.deleteSaveList(userId, serviceId);
        res.status(204).json({});
    });


    // @desc        Adding review to a service
    // @rout        PATCH /services/:id/review
    // @acce        Buyer
    addReviews = asyncHandler(async (req: CustomRequest, res: Response) => {
        const serviceId = req.params.id as string;
        const user = req.headers['user'] as UserModel;
        const reviewDetails = req.body as AddReviewBody;

        await this.serviceService.addReviews(user, serviceId, reviewDetails);
        res.status(204).json({});
    });


    // @desc        Getting all the reviews
    // @rout        GET /services/:id/review
    // @acce        Public
    getReviews = asyncHandler(async (req: CustomRequest, res: Response) => {
        const serviceId = req.params.id as string;

        const reviews = await this.serviceService.getReviews(serviceId);
        res.json(reviews || {});
    });

}