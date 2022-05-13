import { ServiceModel } from "./service.interface";

export interface SaveListModel {
    _id: string;
    user: string;
    saveList: string[] | ServiceModel[];
}
