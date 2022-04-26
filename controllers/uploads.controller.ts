import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import cloudinary from 'cloudinary';
import { HttpException } from '../exceptions';


export class UploadController {

    // @desc       Uploading single image
    // @rout       POST /uploads/image
    imageUpload = asyncHandler(async (req: Request, res: Response) => {
        if (req.file)
            cloudinary.v2.uploader.upload_stream(
                {
                    resource_type: "image",
                    folder: 'Lancer'
                },
                (error, result: any) => {                    
                    if (error)
                        throw new HttpException(400, "Failed to upload the image");
                    else
                        res.status(201).json({
                            public_id: result.public_id,
                            url: result.secure_url
                        });
                }
            ).end(req.file.buffer);
        else
            throw new HttpException(400, 'File not found');
    });


    // @desc       Uploading single image
    // @rout       POST /uploads/image
    fileUpload = asyncHandler(async (req: Request, res: Response) => {
        console.log(req.file);
        
        if (req.file)
            cloudinary.v2.uploader.upload_stream(
                {
                    resource_type: "raw",
                    folder: 'Lancer'
                },
                (error, result: any) => {       
                    if (error)
                        throw new HttpException(400, "Failed to upload the image");
                    else
                        res.status(201).json({
                            public_id: result.public_id,
                            url: result.secure_url
                        });
                }
            ).end(req.file.buffer);
        else
            throw new HttpException(400, 'File not found');
    });

}