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
