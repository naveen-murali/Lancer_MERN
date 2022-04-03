import { Types } from "mongoose";
import { NotFoundException } from '../exceptions';
import { Category, Service, SubCategory } from '../models';
import { Coll } from '../util';
import { CreateSeviceBody, EditSeviceBody } from '../validation';

interface SearchInter {
    search: string;
    page: string;
    pageSize: string;
    sort: Object;
}

export class ServiceService {
    private Service = Service;
    private Category = Category;
    private SubCategory = SubCategory;

    createService = async (userId: string, serviceData: CreateSeviceBody) => {
        const [cat, sub] = await Promise.all([
            this.Category.exists({
                _id: new Types.ObjectId(serviceData.category),
                isBlocked: false
            }).exec(),
            this.SubCategory.exists({
                _id: new Types.ObjectId(serviceData.subcategory),
                category: new Types.ObjectId(serviceData.category),
                isBlocked: false
            }).exec()
        ]);
        if (!cat)
            throw new NotFoundException('category not found');
        if (!sub)
            throw new NotFoundException('subcategory not found for the corresponding category.');

        const newService = new this.Service({ user: userId, ...serviceData });
        return await newService.save();
    };

    editService = async (serviceId: string, userId: string, serviceData: EditSeviceBody) => {
        const service = await this.Service.findOne({
                _id: new Types.ObjectId(serviceId),
                user: new Types.ObjectId(userId)
            });

        if (!service)
            throw new NotFoundException('service not found');

        if (
            (serviceData.category || serviceData.category) &&
            !(
                service.category.toString() === serviceData.category
                &&
                service.subcategory.toString() === serviceData.subcategory
            )
        ) {
            let category = serviceData.category || service.category;
            let subcategory = serviceData.subcategory || service.subcategory;

            const [cat, sub] = await Promise.all([
                this.Category.exists({
                    _id: new Types.ObjectId(category),
                    isBlocked: false
                }).exec(),
                this.SubCategory.exists({
                    _id: new Types.ObjectId(subcategory),
                    category: new Types.ObjectId(category),
                    isBlocked: false
                }).exec()
            ]);
            if (!cat)
                throw new NotFoundException('category not found');
            if (!sub)
                throw new NotFoundException('subcategory not found for the corresponding category.');
        }

        service.title = serviceData.title || service.title;
        service.description = serviceData.description || service.description;
        service.category = serviceData.category || service.category;
        service.subcategory = serviceData.subcategory || service.subcategory;
        service.images = serviceData.images || service.images;
        service.packages = serviceData.packages || service.packages;

        return await service.save();
    };

    getServices = async (query: SearchInter) => {
        const keys = Object.keys(query.sort);
        const values = Object.values(query.sort);

        let sort = {} as any;
        values.forEach((value, index) => {
            sort = {
                ...sort,
                [keys[index]]: Number(value)
            };
        });

        const pageSize = Number(query.pageSize) || 10;
        const page = Number(query.page) || 1;

        const keyword = query.search
            ? {
                $or: [
                    {
                        title: {
                            $regex: query.search,
                            $options: 'i'
                        }
                    },
                    {
                        description: {
                            $regex: query.search,
                            $options: 'i'
                        }
                    }
                ],
                isBlocked: false,
                isDeleted: false,
                isActive: true
            }
            : {};

        const count = await this.Service.countDocuments({ ...keyword });
        const services = await this.Service.aggregate([
            {
                $match: { ...keyword }
            },
            {
                $lookup: {
                    from: Coll.USER,
                    let: { user: "$user" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$user"]
                                },
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                image: 1
                            }
                        },
                        {
                            $lookup: {
                                from: Coll.SELLER_INFO,
                                localField: "_id",
                                foreignField: "user",
                                as: 'user'
                            }
                        },
                        {
                            $replaceRoot: {
                                newRoot: {
                                    $mergeObjects: [
                                        "$$ROOT", { $arrayElemAt: ["$user", 0] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                user: 0
                            }
                        }
                    ],
                    as: 'sellerInfo'
                }
            },
            {
                $unwind: "$sellerInfo"
            },
            {
                $project: {
                    user: 0,
                    isActive: 0,
                    isDeleted: 0,
                    isBlocked: 0
                }
            },
            {
                $sort: sort || { _id: -1 }
            },
            {
                $limit: pageSize
            },
            {
                $skip: (page - 1) * pageSize
            }
        ]);

        return {
            search: query.search,
            services,
            page,
            pageSize,
            pages: Math.ceil(count / pageSize)
        };
    };

    getUsersServices = async (userId: string, query: SearchInter) => {
        const pageSize = Number(query.pageSize) || 10;
        const page = Number(query.page) || 1;

        const keyword = query.search
            ? {
                $or: [
                    {
                        title: {
                            $regex: query.search,
                            $options: 'i'
                        }
                    },
                    {
                        description: {
                            $regex: query.search,
                            $options: 'i'
                        }
                    }
                ],
                user: new Types.ObjectId(userId),
                isBlocked: false,
                isDeleted: false,
            }
            : {};

        const count = await this.Service.countDocuments({ ...keyword });
        const services = await this.Service.find({ ...keyword })
            .select('-isDeleted -isBlocked')
            .sort(query.sort || { _id: -1 })
            .limit(pageSize)
            .skip((page - 1) * pageSize);

        return {
            search: query.search,
            services,
            page,
            pageSize,
            pages: Math.ceil(count / pageSize)
        };
    };

    getServicesForAdmin = async (query: SearchInter) => {
        const pageSize = Number(query.pageSize) || 10;
        const page = Number(query.page) || 1;

        const keyword = query.search
            ? {
                $or: [
                    {
                        title: {
                            $regex: query.search,
                            $options: 'i'
                        }
                    },
                    {
                        description: {
                            $regex: query.search,
                            $options: 'i'
                        }
                    }
                ],
                isBlocked: false,
                isDeleted: false,
            }
            : {};

        const count = await this.Service.countDocuments({ ...keyword });
        const services = await this.Service.find({ ...keyword })
            .sort(query.sort || { _id: -1 })
            .limit(pageSize)
            .skip((page - 1) * pageSize);

        return {
            search: query.search,
            services,
            page,
            pageSize,
            pages: Math.ceil(count / pageSize)
        };
    };

    activateService = async (serviceId: string) => {
        const service = await this.Service.findById(serviceId);

        if (!service)
            throw new NotFoundException("service not found");

        service.isActive = true;
        await service.save();
        
        return true;
    };

    deactivateService = async (serviceId: string) => {
        const service = await this.Service.findById(serviceId);

        if (!service)
            throw new NotFoundException("service not found");

        service.isActive = false;
        await service.save();
        
        return true;
    };
    
    blockService = async (serviceId: string) => {
        const service = await this.Service.findById(serviceId);

        if (!service)
            throw new NotFoundException("service not found");

        service.isBlocked = true;
        await service.save();
        
        return true;
    };
    
    unblockService = async (serviceId: string) => {
        const service = await this.Service.findById(serviceId);

        if (!service)
            throw new NotFoundException("service not found");

        service.isBlocked = false;
        await service.save();
        
        return true;
    };
}