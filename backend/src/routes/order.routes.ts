import { Router } from 'express';
import { OrderController } from '../controllers';
import { Routes } from "../interface";
import { checkRoles, protect } from '../middleware';
import { Role } from '../util';

export class OrderRoutes implements Routes {
    public path: string = "/orders";
    public router: Router = Router();
    private orderController: OrderController = new OrderController();

    constructor() { this.initializeRoutes(); }

    initializeRoutes(): void {
        const orders = this.path;

        const {
            getAllOrders,
            cancelOrder,
            getOneOrder,
            takeRevision,
            completeOrder
        } = this.orderController;

        this.router
            .route(`${orders}`)
            .get(protect, checkRoles([Role.BUYER, Role.SELLER]), getAllOrders);

        this.router
            .route(`${orders}/:id/complete`)
            .patch(protect, checkRoles([Role.BUYER, Role.SELLER]), completeOrder);

        this.router
            .route(`${orders}/:id/revision`)
            .patch(protect, checkRoles([Role.BUYER, Role.SELLER]), takeRevision);

        this.router
            .route(`${orders}/:id/cancel`)
            .patch(protect, checkRoles([Role.BUYER, Role.SELLER]), cancelOrder);

        this.router
            .route(`${orders}/:id`)
            .get(protect, checkRoles([Role.BUYER, Role.SELLER]), getOneOrder);
    }

}