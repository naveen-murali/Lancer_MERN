import { Router } from "express";
import { Routes } from "../interface";
import { protect } from "../middleware";

import { UploadController } from "../controllers";
import { uploadImage, uploadFile } from "../config";

export class UploadRoutes implements Routes {
    public path: string = "/uploads";
    public router: Router = Router();
    public uploadController: UploadController = new UploadController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes(): void {
        const uploads = this.path;
        const { imageUpload, fileUpload } = this.uploadController;

        this.router
            .route(`${uploads}/image`)
            .post(protect, uploadImage.single("image"), imageUpload);

        this.router
            .route(`${uploads}/file`)
            .post(protect, uploadFile.single("file"), fileUpload);
    }
}
