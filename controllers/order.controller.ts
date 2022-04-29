import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { CustomRequest, OrderSearchModel } from '../interface';
import { OrderService } from '../services';

export class OrderController {

    public orderService: OrderService = new OrderService();


    // @desc        Get all orders of the user
    // @rout        POST /orders
    // @acce        User[Buyer/Seller]
    getOneUserOrders = asyncHandler(async (req: CustomRequest, res: Response) => {
        const userId = req.headers['user']?._id as string;
        const query = <OrderSearchModel><unknown>req.query;

        const orders = await this.orderService.getOneUserOrders(userId, query);
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


    // @desc        Get all orders for admin.
    // @rout        GET /orders/admin
    // @acce        ADMIN
    getAllOrdersForAdmin = asyncHandler(async (req: CustomRequest, res: Response) => {
        const query = <OrderSearchModel><unknown>req.query;
        const order = await this.orderService.getAllOrdersForAdmin(query);
        res.json(order);
    });


    // @desc        Get weekly orders details.
    // @rout        GET /orders/weekly
    // @acce        ADMIN
    getWeeklyOrders = asyncHandler(async (_req: CustomRequest, res: Response) => {
        const order = await this.orderService.getWeeklyOrders();
        res.json(order);
    });


    // @desc        Get yearly orders details.
    // @rout        GET /orders/yearly
    // @acce        ADMIN
    getMonthlyOrders = asyncHandler(async (_req: CustomRequest, res: Response) => {
        const order = await this.orderService.getMonthlyOrders();
        res.json(order);
    });
}