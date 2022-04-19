export enum TransactionType {
    REFUND = "refund",
    WITHDRAW = "withdraw"
}

export enum TransactionStatus {
    PENDING = "pending",
    REJECTED = "rejected",
    COMPLETED = "completed"
}

export enum PaypalRefundStatus {
    CANCELLED = "CANCELLED",
    PENDING = "PENDING",
    COMPLETED = "COMPLETED"
}