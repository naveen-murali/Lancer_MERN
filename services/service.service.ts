import { Types } from "mongoose";
import { Coll } from '../util';
import { BadRequestException, NotFoundException } from '../exceptions';
import { SaveList } from '../models/saveList.model';
import { ServiceSearchModal, UserModel } from '../interface';
import { AddReviewBody, CreateSeviceBody, EditSeviceBody } from '../validation';
import { Category, Chat, Service, SubCategory, Review } from '../models';

export class ServiceService {
    private Chat = Chat;
    private Service = Service;
    private SaveList = SaveList;
    private Category = Category;
    private SubCategory = SubCategory;
    private Review = Review;

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
                service.category.toString() === serviceData.category &&
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


    getServices = async (query: ServiceSearchModal) => {
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

        const keyword: any = query.search
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
                isActive: true,
            }
            : {};

        if (query.category)
            keyword.category = new Types.ObjectId(query.category);

        if (query.subcategory)
            keyword.subcategory = new Types.ObjectId(query.subcategory);

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


    getUsersServices = async (userId: string, query: ServiceSearchModal) => {
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
                category: query.category || { $exists: true },
                subcategory: query.subcategory || { $exists: true }
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


    getOneService = async (serviceId: string) => {
        const service = await this.Service.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: ["$_id", new Types.ObjectId(serviceId)]
                    }
                }
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
                            $project: { _id: 1, name: 1, image: 1 }
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
                            $project: { user: 0 }
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
                    // user: 0,
                    isActive: 0,
                    isDeleted: 0,
                    isBlocked: 0
                }
            }
        ]).exec();

        return service[0];
    };


    getOneServiceForAdmin = async (serviceId: string) => {
        const service = await this.Service.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: ["$_id", new Types.ObjectId(serviceId)]
                    }
                }
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
                            $project: { _id: 1, name: 1, image: 1 }
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
                            $project: { user: 0 }
                        }
                    ],
                    as: 'sellerInfo'
                }
            },
            {
                $unwind: "$sellerInfo"
            }
        ]).exec();

        return service[0];
    };


    getServicesForAdmin = async (query: ServiceSearchModal) => {
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
                category: query.category || { $exists: true },
                subcategory: query.subcategory || { $exists: true }
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

        const chats = await this.Chat.find({ "order.service": new Types.ObjectId(serviceId) }).exec();
        chats?.forEach(chat => {
            chat.isBlocked = true;
            chat.save();
        });

        service.isBlocked = true;
        await service.save();

        return true;
    };


    unblockService = async (serviceId: string) => {
        const service = await this.Service.findById(serviceId);

        if (!service)
            throw new NotFoundException("service not found");

        const chats = await this.Chat.find({ "order.service": new Types.ObjectId(serviceId) }).exec();
        chats?.forEach(chat => {
            chat.isBlocked = false;
            chat.save();
        });

        service.isBlocked = false;
        await service.save();

        return true;
    };


    setSaveList = async (userId: string, serviceId: string) => {
        await this.SaveList.findOneAndUpdate(
            { user: userId },
            {
                $addToSet: {
                    saveList: new Types.ObjectId(serviceId)
                }
            },
            { upsert: true }
        );

        return true;
    };


    getSaveList = async (userId: string) => {
        return await this.SaveList.findOne({ user: userId })
            .populate("saveList", "-isBlocked -isDeleted -isActive");
    };


    deleteSaveList = async (userId: string, serviceId: string) => {
        return await this.SaveList.updateOne(
            {
                user: userId
            },
            {
                $pull: {
                    saveList: new Types.ObjectId(serviceId)
                }
            }
        );
    };


    addReviews = async (user: UserModel, serviceId: string, reviewDetails: AddReviewBody) => {
        let [review, service] = await Promise.all([
            this.Review.findOne({ service: serviceId }),
            this.Service.findById(serviceId)
        ]);

        if (!service)
            throw new NotFoundException("service not found");

        service.totalReview++;

        if (!review) {
            review = new this.Review({
                service: serviceId,
                reviews: [{
                    user: new Types.ObjectId((user._id as string)),
                    rating: reviewDetails.rating,
                    description: reviewDetails.description
                }]
            });
            service.rating = reviewDetails.rating;
        } else {
            if (review.reviews.some(review => review.user.toString() === user._id?.toString()))
                throw new BadRequestException("you already reviewed the service");

            review.reviews = [
                ...review.reviews,
                {
                    user: new Types.ObjectId((user._id as string)),
                    rating: reviewDetails.rating,
                    description: reviewDetails.description
                }
            ];
            service.rating = review.reviews.reduce((acc, review) =>
                acc + review.rating, 0) / review.reviews.length;
        }

        await Promise.all([service.save(), review.save()]);
        return true;
    };


    getReviews = async (serviceId: string) => {
        return await this.Review.findOne({ service: serviceId })
            .populate("reviews.user", "name image");
    };
}