import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { TransactionService } from '../services';
import { CreatePaypalPaymentBody, CreateWithdrawalRequestBody } from '../validation';
import { CustomRequest, TransactionSearchModel, UserModel } from '../interface';

export class TransactionController {

    public transactionService: TransactionService = new TransactionService();


    // @desc        For creating a transation 
    // @rout        GET /api/transactions
    // @acce        Admin
    createPaypalPyament = asyncHandler(async (req: CustomRequest, res: Response) => {
        const userId = (req.headers['user'] as UserModel)._id as string;
        const { chat } = <CreatePaypalPaymentBody>req.body;

        const transaction = await this.transactionService.createPaypalPyament(userId, chat);
        res.status(201).json(transaction);
    });


    // @desc        Get user transactions
    // @rout        GET /api/transactions
    // @acce        User
    getUserTransactions = asyncHandler(async (req: CustomRequest, res: Response) => {
        const query = <TransactionSearchModel><unknown>req.query;
        const userId = (req.headers['user'] as UserModel)._id as string;

        const transactions = await this.transactionService.getUserTransactions(userId, query);
        res.json(transactions);
    });


    // @desc        Get all transactions
    // @rout        GET /api/transactions/admin
    // @acce        Admin
    getAllTransactions = asyncHandler(async (req: CustomRequest, res: Response) => {
        const query = <TransactionSearchModel><unknown>req.query;

        const transactions = await this.transactionService.getAllTransactions(query);
        res.json(transactions);
    });


    // @desc        Add Withdraw requests
    // @rout        POST /api/transactions/:id/withdraw
    // @acce        User[Buyer/Seller]
    withdrawRequest = asyncHandler(async (req: CustomRequest, res: Response) => {
        const user = req.headers["user"] as UserModel;
        const withdrawData: CreateWithdrawalRequestBody = req.body;

        const withdrawRequest = await this.transactionService.withdrawRequest(user, withdrawData);
        res.status(201).json(withdrawRequest);
    });


    // @desc        Approving a withdrawal
    // @rout        PATCH /api/transactions/:id/withdraw
    // @acce        Admin
    withdrawTransaction = asyncHandler(async (req: CustomRequest, res: Response) => {
        const transactionId = req.params.id as string;

        await this.transactionService.withdrawTransaction(transactionId);
        res.status(204).json({});
    });


    // @desc        Refund A Transactions
    // @rout        PATCH /api/transactions/:id/refund
    // @acce        Admin
    refundTransaction = asyncHandler(async (req: CustomRequest, res: Response) => {
        const transactionId = req.params.id as string;

        await this.transactionService.refundTransaction(transactionId);
        res.status(204).json({});
    });


    // @desc        For cancelling  the transaction
    // @rout        GET /api/transactions/:id/cancel
    // @acce        Admin
    cancelTransaction = asyncHandler(async (req: CustomRequest, res: Response) => {
        const transactionId = req.params.id as string;

        await this.transactionService.cancelTransaction(transactionId);
        res.status(204).json({});
    });

}