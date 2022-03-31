import { Role } from ".";
import { UserModel } from '../interface';

export class AuthResponse {
    public _id: string;
    public name: string;
    public email: string;
    public phone: string;
    public isEmailVarified?: boolean;
    public isPhoneVerified?: boolean;
    public image: object;
    public role: Role[];
    public wallet: number;
    public referralId: string;
    public token: string;
    public sellerInfo: any;

    constructor(user: any, token: string) {
        this._id = `${user._id}`;
        this.name = user.name || '';
        this.email = user.email || '';
        this.phone = user.phone || '';
        this.isEmailVarified = user.isEmailVarified;
        this.isPhoneVerified = user.isPhoneVerified;

        this.image = user.image || {
            public_id: "", url: ""
        };

        this.role = user.role || [];
        this.wallet = user.wallet || 0;
        this.referralId = user.referralId || "";
        this.token = token || '';

        if (this.role.includes(Role.SELLER))
            this.sellerInfo = user.sellerInfo;
    }

}