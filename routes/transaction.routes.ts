import { Router } from "express";
import { Role } from "../util";
import { Routes } from "../interface";
import { TransactionController } from "../controllers";
import { checkRoles, protect, ValidateBody } from "../middleware";
import { CreatePaypalPaymentBodyVal, CreateWithdrawalRequestBodyVal } from "../validation";

export class TransactionRoutes implements Routes {
    public path: string = "/transactions";
    public router: Router = Router();
    private transactionController: TransactionController = new TransactionController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes(): void {
        const transactions = this.path;

        const {
            createPaypalPyament,
            getUserTransactions,
            getAllTransactions,
            refundTransaction,
            cancelTransaction,
            withdrawTransaction,
            withdrawRequest,
            getReports,
        } = this.transactionController;

        this.router
            .route(`${transactions}`)
            .get(protect, checkRoles([Role.BUYER]), getUserTransactions);

        this.router
            .route(`${transactions}/admin`)
            .get(protect, checkRoles([Role.ADMIN]), getAllTransactions);

        this.router
            .route(`${transactions}/report`)
            .get(protect, checkRoles([Role.ADMIN]), getReports);

        this.router
            .route(`${transactions}/payment/paypal`)
            .post(
                protect,
                checkRoles([Role.BUYER]),
                ValidateBody(CreatePaypalPaymentBodyVal.safeParse),
                createPaypalPyament
            );

        this.router
            .route(`${transactions}/withdraw`)
            .post(
                protect,
                checkRoles([Role.BUYER]),
                ValidateBody(CreateWithdrawalRequestBodyVal.safeParse),
                withdrawRequest
            );

        this.router
            .route(`${transactions}/:id/withdraw`)
            .patch(protect, checkRoles([Role.ADMIN]), withdrawTransaction);

        this.router
            .route(`${transactions}/:id/refund`)
            .patch(protect, checkRoles([Role.ADMIN]), refundTransaction);

        this.router
            .route(`${transactions}/:id/cancel`)
            .patch(protect, checkRoles([Role.ADMIN]), cancelTransaction);
    }
}
