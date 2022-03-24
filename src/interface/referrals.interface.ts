interface Referrals {
    user: string;
    amount: number;
    createdAt?: Date;
    updateedAt?: Date;
}

export interface ReferralsModel {
    user: string;
    referrals: Referrals[];
}