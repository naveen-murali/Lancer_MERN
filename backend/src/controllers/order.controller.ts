import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { CustomRequest, OrderSearchModel } from '../interface';
import { OrderService } from '../services';

export class OrderController {

    public orderService: OrderService = new OrderService();


    // @desc        Get all the users orders
    // @rout        POST /orders
    // @acce        User[Buyer/Seller]
    getAllOrders = asyncHandler(async (req: CustomRequest, res: Response) => {
        const userId = req.headers['user']?._id as string;
        const query = <OrderSearchModel><unknown>req.query;

        const orders = await this.orderService.getAllOrders(userId, query);
        res.json(orders);
    });


    // @desc        For completeing the order.
    // @rout        PATCH /orders/:id/revision
    // @acce        User[Buyer/Seller]
    completeOrder = asyncHandler(async (req: CustomRequest, res: Response) => {
        const userId = req.headers['user']?._id as string;
        const orderId = req.params.id as string;

        await this.orderService.completeOrder(userId, orderId);
        res.status(204).json({});
    });


    // @desc        For taking the revision
    // @rout        PATCH /orders/:id/revision
    // @acce        User[Buyer/Seller]
    takeRevision = asyncHandler(async (req: CustomRequest, res: Response) => {
        const userId = req.headers['user']?._id as string;
        const orderId = req.params.id as string;

        await this.orderService.takeRevision(userId, orderId);
        res.status(204).json({});
    });


    // @desc        Cancel an order
    // @rout        PATCH /orders/:id/cancel
    // @acce        User[Buyer/Seller]
    cancelOrder = asyncHandler(async (req: CustomRequest, res: Response) => {
        const userId = req.headers['user']?._id as string;
        const orderId = req.params.id as string;

        await this.orderService.cancelOrder(userId, orderId);
        res.status(201).json({ message: "order cancelled, refund requests has been placed" });
    });


    // @desc        Get one order of a user.
    // @rout        GET /orders/:id
    // @acce        User[Buyer/Seller]
    getOneOrder = asyncHandler(async (req: CustomRequest, res: Response) => {
        const userId = req.headers['user']?._id as string;
        const orderId = req.params.id as string;

        const order = await this.orderService.getOneOrder(userId, orderId);
        res.json(order);
    });
}