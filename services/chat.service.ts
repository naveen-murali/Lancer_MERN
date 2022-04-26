import { Types } from 'mongoose';
import { Chat, Message, Service, User } from '../models';
import { CreateRoomBody } from '../validation';
import { NotFoundException, HttpException } from '../exceptions';
import { SearchModel } from '../interface';
import { AcceptStatus, MessageTypes } from '../util';


export class ChatService {
    private Chat = Chat;
    private Message = Message;
    private User = User;
    private Service = Service;


    getChats = async (userId: string) => {
        return await this.Chat.find(
            {
                members: {
                    $in: [userId]
                },
                isBlocked: false
            })
            .populate({ path: 'members', select: 'name image' })
            .sort({ _id: -1 })
            .select('-isBlocked');
    };


    createChat = async (userId: string, roomData: CreateRoomBody) => {
        const [seller, service] = await Promise.all(
            [
                this.User.findById(roomData.seller).select('isBlocked _id'),
                this.Service.findOne({
                    _id: roomData.service,
                    user: new Types.ObjectId(roomData.seller)
                }).select('_id packages'),
            ]
        );

        if (!seller)
            throw new NotFoundException("seller is not found");

        if (seller && seller.isBlocked)
            throw new HttpException(400, "can not create the chat");

        if (!service)
            throw new NotFoundException("service is not found");

        let chat = await this.Chat.findOne({
            members: [userId, roomData.seller],
            "order.service": roomData.service,
            isOrdered: false
        });

        if (!chat) {
            chat = new this.Chat({
                members: [userId, roomData.seller],
                order: { ...roomData, buyer: userId },
                package: service.packages[roomData.package]
            });

            chat = await chat.save();
        }

        const negotiationExists = await this.Message.exists({
            chat: chat._id,
            acceptStatus: {
                $exists: true,
                $ne: AcceptStatus.REJECTED
            }
        });

        if (!negotiationExists) {
            if (chat) {
                chat.order.package = roomData.package;
                chat.package = service.packages[roomData.package];
                await chat.save();
            }

            const description = `I would like to order this service with it's "${roomData.package}" package.`;
            const newMessage = new this.Message({
                chat: chat._id,
                sender: userId,
                receiver: roomData.seller,
                acceptStatus: AcceptStatus.PENDING,
                type: MessageTypes.PACKEGE,
                description,
                price: service.packages[roomData.package].price,
                revision: service.packages[roomData.package].revision,
                deliveryTime: service.packages[roomData.package].deliveryTime,
                service: roomData.service
            });

            await newMessage.save();
        }

        return chat;
    };


    getMessagesOfChat = async (userId: string, chatId: string, search: SearchModel) => {
        const pageSize = Number(search.pageSize) || 10;
        const page = Number(search.page) || 1;

        const chat = await this.Chat.exists({
            _id: new Types.ObjectId(chatId),
            members: {
                $in: [new Types.ObjectId(userId)]
            },
            isBlocked: false
        });
        if (!chat)
            throw new NotFoundException("Chat not found");

        const chatFilter = {
            chat: new Types.ObjectId(chatId)
        };
        const [count, messages] = await Promise.all([
            this.Message.countDocuments(chatFilter),
            this.Message.find(chatFilter)
                .sort({ _id: -1 })
                .limit(pageSize)
                .skip((page - 1) * pageSize)
        ]);

        return {
            messages,
            page,
            pageSize,
            pages: Math.ceil(count / pageSize)
        };
    };


    getOneChat = async (userId: string, chatId: string) => {
        const chat = await this.Chat.findOne({
            _id: new Types.ObjectId(chatId),
            members: {
                $in: [new Types.ObjectId(userId)]
            },
            isBlocked: false
        })
            .populate("order.buyer order.seller", "name image")
            .select("-isBlocked");

        if (!chat)
            throw new NotFoundException("Chat not found");

        return chat;
    };


    removeOrderFromChat = async (chatId: string) => {
        return await this.Chat.findByIdAndUpdate(chatId, {
            $set: { isOrdered: false }
        });
    };


    sendNotification = async (chat: string, message: string) => {
        return await this.Message.create({
            chat: chat,
            type: MessageTypes.NOTIFICATION,
            description: message
        }).catch(() => { });
    };
}