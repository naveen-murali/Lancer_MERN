import { NotFoundException } from '../exceptions';
import { User } from '../models';

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

    getUserById = async (id: string) => {
        const user = await this.User.findById(id).exec();

        if (!user)
            throw new NotFoundException('user not found');
        else
            return user;
    };

}