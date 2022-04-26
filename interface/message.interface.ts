import { AcceptStatus, MessageTypes } from '../util';
import { ServiceImage } from './common.interface';

export interface MessageModel {
    _id: string;
    chat: string;
    sender: string;
    receiver: string;
    type: MessageTypes;
    description: string;
    file: ServiceImage;
    files: ServiceImage[];
    price: Number;
    revision: Number;
    deliveryTime: Number;
    acceptStatus: AcceptStatus;
    createdAt: Date;
    updatedAt: Date;
}