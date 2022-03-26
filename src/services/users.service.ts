import { Types } from 'mongoose';
import { HttpException, NotFoundException } from '../exceptions';
import { User } from '../models';
import { SellerInfo } from '../models/sellerInfor.model';
import { Coll, Role } from '../util';
import { AddSellerInfoBody } from '../validation';

interface SearchInter {
    search: string;
    page: string;
    pageSize: string;
    sort: Object;
}

export class UserService {
    private User = User;

    getAllUsers = async (query: SearchInter) => {
        const pageSize = Number(query.pageSize) || 10;
        const page = Number(query.page) || 1;

        const keyword = query.search
            ? {
                $or: [
                    {
                        name: {
                            $regex: query.search,
                            $options: 'i'
                        }
                    },
                    {
                        email: {
                            $regex: query.search,
                            $options: 'i'
                        }
                    }
                ]
            }
            : {};

        const count = await this.User.countDocuments({ ...keyword });
        const users = await this.User.find({ ...keyword })
            .select('-password')
            .sort(query.sort || { _id: -1 })
            .limit(pageSize)
            .skip((page - 1) * pageSize);

        return {
            search: query.search,
            users,
            page,
            pageSize,
            pages: Math.ceil(count / pageSize)
        };
    };


    addSellerInfo = async (userId: string, sellerData: AddSellerInfoBody) => {
        const userExists = await User.findById(userId).select('-password -isBlocked');

        if (!userExists)
            throw new NotFoundException('user not found');

        if (!userExists.isEmailVarified || !userExists.isPhoneVerified)
            throw new HttpException(401, "credential varification is not completed");

        const newSellerInfo = await SellerInfo.create({
            ...sellerData,
            user: userId
        });
        userExists.role.push(Role.SELLER);
        await userExists.save();

        delete userExists.isBlocked;

        return {
            user: userExists,
            sellerInfo: newSellerInfo
        };
    };


    getUserById = async (id: string) => {
        const user = await this.User.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: Coll.SELLER_INFO,
                    localField: '_id',
                    foreignField: 'user',
                    as: 'sellerInfo'
                }
            },
            {
                $unset: ["isBlocked", "password"]
            }
        ]).exec();

        if (!user)
            throw new NotFoundException('user not found');
        else
            return user;
    };

}