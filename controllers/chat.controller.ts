import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { HttpException } from '../exceptions';
import { CustomRequest, UserModel } from '../interface';
import { SearchModel } from '../interface';
import { ChatService } from '../services';
import { CreateRoomBody } from '../validation';


export class ChatsController {
    public messageService: ChatService = new ChatService();


    // @desc       Get rooms of a user.
    // @rout       GET /chats
    getChats = asyncHandler(async (req: CustomRequest, res: Response) => {
        const userId = (req.headers['user'] as UserModel)._id;

        const rooms = await this.messageService.getChats(userId as string);
        res.json(rooms);
    });


    // @desc       Creating conversation for an offer.
    // @rout       POST /chats
    createChat = asyncHandler(async (req: CustomRequest, res: Response) => {
        const userId = (req.headers['user'] as UserModel)._id;
        const roomData = <CreateRoomBody>req.body;

        const createdRoom = await this.messageService.createChat((userId as string), roomData);
        res.status(201).json(createdRoom);
    });


    // @desc       Getting messages of a chats.
    // @rout       POST /chats/:id/messages
    getMessagesOfChat = asyncHandler(async (req: CustomRequest, res: Response) => {
        const userId = (req.headers['user'] as UserModel)._id;
        const chatId = req.params.id;
        const query = req.query as unknown as SearchModel;

        const messages = await this.messageService.getMessagesOfChat((userId as string), chatId, query);
        res.json(messages);
    });


    // @desc       Getting one of a chats.
    // @rout       POST /chats/:id
    getOneChat = asyncHandler(async (req: CustomRequest, res: Response) => {
        const userId = (req.headers['user'] as UserModel)._id;
        const chatId = req.params.id;

        const chat = await this.messageService.getOneChat((userId as string), chatId);
        res.json(chat);
    });

}