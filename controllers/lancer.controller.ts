import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { LancerService } from '../services';
import { UpdateLancerBody } from '../validation';

export class LancerController {

    public lancerService: LancerService = new LancerService();


    // @desc        Get Lancer account details
    // @rout        GET /lancer
    // @acce        Admin
    getLancer = asyncHandler(async (req: Request, res: Response) => {
        const lancer = await this.lancerService.getLancer();
        res.json(lancer);
    });


    // @desc        Get Lancer account details
    // @rout        GET /lancer
    // @acce        Admin
    getLancersCounts = asyncHandler(async (req: Request, res: Response) => {
        const counts = await this.lancerService.getLancersCounts();
        res.json(counts);
    });


    // @desc        Update Lancer account details
    // @rout        PUT /lancer
    // @acce        Admin
    updateLancer = asyncHandler(async (req: Request, res: Response) => {
        const lancerData = <UpdateLancerBody>req.body;

        await this.lancerService.updateLancer(lancerData);
        res.status(201).json({});
    });
}