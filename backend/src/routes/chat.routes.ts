import { Router } from 'express';
import { Routes } from "../interface";
import { checkRoles, protect, ValidateBody } from '../middleware';
import { MessageController } from '../controllers';
import { CreateRoomBodyVal } from '../validation';
import { Role } from '../util';

export class MessageRoutes implements Routes {
    public path: string = "/chats";
    public router: Router = Router();
    public uploadController: MessageController = new MessageController();

    constructor() { this.initializeRoutes(); }

    initializeRoutes(): void {
        const chats = this.path;
        const {
            getChats,
            createChat,
            getOneChat,
            getMessagesOfChat
        } = this.uploadController;

        this.router
            .route(`${chats}`)
            .get(protect, checkRoles([Role.SELLER, Role.BUYER]), getChats)
            .post(protect, checkRoles([Role.BUYER]), ValidateBody(CreateRoomBodyVal.safeParse), createChat);

        this.router
            .route(`${chats}/:id/messages`)
            .get(protect, checkRoles([Role.SELLER, Role.BUYER]), getMessagesOfChat);

        this.router
            .route(`${chats}/:id`)
            .get(protect, checkRoles([Role.SELLER, Role.BUYER]), getOneChat);
    }

}