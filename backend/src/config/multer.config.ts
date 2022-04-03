import { Request } from 'express';
import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import { ParamsDictionary } from 'express-serve-static-core';
import { HttpException } from '../exceptions';

const storage = multer.memoryStorage();

const checkImageType = (_req: Request<ParamsDictionary, any, any, Record<string, any>>, file: Express.Multer.File, cb: FileFilterCallback) => {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname)
        return cb(null, true);
    else
        return cb(new HttpException(400, "Please provide images only with /jpg|jpeg|png/ types"));
};

export const uploadImage = multer({
    storage,
    fileFilter: (req: Request<ParamsDictionary, any, any, Record<string, any>>, file: Express.Multer.File, cb: FileFilterCallback) =>
        checkImageType(req, file, cb)
});

export const uploadFile = multer({
    storage,
    limits: {
        fileSize: Number(process.env.MULTER_FILE_LIMIT)
    }
});