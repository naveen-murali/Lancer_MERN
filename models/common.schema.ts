import { Schema } from 'mongoose';


export const Image = new Schema(
    {
        public_id: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: false,
        }
    },
    {
        _id: false
    }
);

export const ServiceImage = new Schema(
    {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    },
    {
        _id: false
    }
);

export const PaymentDetailsModel = new Schema(
    {
        commission: {
            type: Number,
            required: true
        },
        platform: {
            type: String,
            required: true
        },
        paymentId: {
            type: String,
            required: true
        },
        capturedId: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        createdAt: {
            type: String,
            required: true
        },
        updatedAt: {
            type: String,
            required: true
        },
    },
    {
        _id: false
    }
);
