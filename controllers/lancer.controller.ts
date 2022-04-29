import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { OrderSearchModel } from '../interface';
import { LancerService } from '../services';
import { UpdateLancerBody } from '../validation';

export class LancerController {

    public lancerService = new LancerService();


    // @desc        Get Lancer account details
    // @rout        GET /lancer
    // @acce        Admin
    getLancer = asyncHandler(async (req: Request, res: Response) => {
        const lancer = await this.lancerService.getLancer();
        res.json(lancer);
    });


    // @desc        Update Lancer account details
    // @rout        PUT /lancer
    // @acce        Admin
    updateLancer = asyncHandler(async (req: Request, res: Response) => {
        const lancerData = <UpdateLancerBody>req.body;

        await this.lancerService.updateLancer(lancerData);
        res.status(201).json({});
    });


    // @desc        Get Lancer account details
    // @rout        GET /lancer/count
    // @acce        Admin
    getLancersCounts = asyncHandler(async (req: Request, res: Response) => {
        const counts = await this.lancerService.getLancersCounts();
        res.json(counts);
    });


    // @desc        Get One User Details for Admin
    // @rout        GET /lancer/users/:id
    // @acce        Admin
    getOneUserDetails = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.params.id as string;

        const user = await this.lancerService.getOneUserDetails(userId);
        res.json(user);
    });


    // @desc        Get One User Orders for Admin
    // @rout        GET /lancer/users/:id/orders
    // @acce        Admin
    getOneUserOrders = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.params.id as string;
        const query = <OrderSearchModel><unknown>req.query;

        const orders = await this.lancerService.getOneUserOrders(userId, query);
        res.json(orders);
    });
}