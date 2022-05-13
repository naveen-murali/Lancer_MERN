import { Types } from "mongoose";
import { Coll, Role } from "../util";
import { UserModel } from "../interface";
import { User, SellerInfo, Referrals } from "../models";
import { HttpException, NotFoundException } from "../exceptions";
import { AddSellerInfoBody, EditSellerInfoBody, EditUserBody } from "../validation";

interface SearchInter {
    search: string;
    page: string;
    pageSize: string;
    sort: Object;
}

export class UserService {
    private User = User;
    private Referrals = Referrals;
    private SellerInfo = SellerInfo;

    getAllUsers = async (query: SearchInter) => {
        const pageSize = Number(query.pageSize) || 10;
        const page = Number(query.page) || 1;

        const keyword = query.search
            ? {
                  $or: [
                      {
                          name: {
                              $regex: query.search,
                              $options: "i",
                          },
                      },
                      {
                          email: {
                              $regex: query.search,
                              $options: "i",
                          },
                      },
                  ],
              }
            : {};

        const count = await this.User.countDocuments({ ...keyword });
        const users = await this.User.find({ ...keyword })
            .select("-password")
            .sort(query.sort || { _id: -1 })
            .limit(pageSize)
            .skip((page - 1) * pageSize);

        return {
            search: query.search,
            users,
            page,
            pageSize,
            pages: Math.ceil(count / pageSize),
        };
    };

    addSellerInfo = async (userId: string, sellerData: AddSellerInfoBody) => {
        const userExists = await this.User.findById(userId).select("-password -isBlocked");

        if (!userExists)
            throw new NotFoundException("user not found");

        if (!userExists.isEmailVarified || !userExists.isPhoneVerified)
            throw new HttpException(401, "credential varification is not completed");

        const newSellerInfo = await this.SellerInfo.create({
            ...sellerData,
            user: userId,
        });
        userExists.role.push(Role.SELLER);
        await userExists.save();

        delete userExists.isBlocked;

        return {
            user: userExists,
            sellerInfo: newSellerInfo,
        };
    };

    getUserById = async (id: string) => {
        const user = await this.User.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(id),
                },
            },
            {
                $lookup: {
                    from: Coll.SELLER_INFO,
                    localField: "_id",
                    foreignField: "user",
                    as: "sellerInfo",
                },
            },
            {
                $unset: ["isBlocked", "password"],
            },
        ]).exec();

        if (!user)
            throw new NotFoundException("user not found");
        else
            return user;
    };

    editUser = async (id: string, userInfo: EditUserBody) => {
        const user = await this.User.findById(id).exec();
        if (!user)
            throw new NotFoundException("user not found");

        user.image = userInfo.image || user.image;
        user.name = userInfo.name || user.name;
        user.password = userInfo.password || user.password;

        await user.save();
        return true;
    };

    blockUser = async (id: string) => {
        const user = await this.User.findById(id).exec();
        if (!user)
            throw new NotFoundException("user not found");

        user.isBlocked = true;

        await user.save();
        return true;
    };

    unblockUser = async (id: string) => {
        const user = await this.User.findById(id).exec();
        if (!user)
            throw new NotFoundException("user not found");

        user.isBlocked = false;

        await user.save();
        return true;
    };

    deductFromSellerEarnings = async (sellerId: string, amount: number) => {
        return await this.SellerInfo.findOneAndUpdate(
            {
                user: sellerId,
            },
            {
                $inc: {
                    sellerEarning: -amount,
                },
            }
        );
    };

    editSellerInfo = async (id: string, editInfo: EditSellerInfoBody) => {
        const sellerInfo = await this.SellerInfo.findOne({ user: id }).exec();
        if (!sellerInfo)
            throw new NotFoundException("seller info not found");

        sellerInfo.description = editInfo.description || sellerInfo.description;
        sellerInfo.personalWebsite = editInfo.personalWebsite || sellerInfo.personalWebsite;
        sellerInfo.certifications = editInfo.certifications || sellerInfo.certifications;
        sellerInfo.skills = editInfo.skills || sellerInfo.skills;

        return await sellerInfo.save();
    };

    getSellerInfo = async (id: string) => {
        const seller = await this.SellerInfo.findOne({ user: id })
            .populate("user", "name image")
            .select("-sellerEarning");

        if (!seller)
            throw new NotFoundException("seller not found");

        const sellerInfo = {
            name: (seller.user as UserModel).name,
            image: (seller.user as UserModel).image,
            description: seller.description,
            personalWebsite: seller.personalWebsite,
            certifications: seller.certifications,
            skills: seller.skills,
        };

        return sellerInfo;
    };

    getUsersEarnings = async (user: UserModel) => {
        const [sellerInfo, referrals] = await Promise.all([
            this.SellerInfo.findOne({ user: user._id }),
            this.Referrals.findOne({ user: user._id }),
        ]);

        const earnings = {
            wallet: user.wallet,
            withdrawedWallet: user.withdrawedWallet,
            sellerEarning: sellerInfo && sellerInfo.sellerEarning,
            referralEarnings: referrals
                ? referrals.referrals.reduce((prev, referral) => prev + referral.amount, 0)
                : 0,
        };

        return earnings;
    };

    getUsersReferrals = async (user: UserModel) => {
        const referrals = await this.Referrals.findOne({ user: user._id });

        return {
            referralNum: user.referralNum || 0,
            referralEarnings: referrals
                ? referrals.referrals.reduce((prev, referral) => prev + referral.amount, 0)
                : 0,
        };
    };
}
