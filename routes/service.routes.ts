import { Router } from 'express';
import { ServiceController } from '../controllers';
import { Routes } from "../interface";
import { protect, checkRoles, ValidateBody } from '../middleware';
import { Role } from '../util';
import { AddReviewBodyVal, AddSaveListBodyVal, CreateSeviceBodyVal, EditSeviceBodyVal } from '../validation';

export class ServiceRoutes implements Routes {
    public path: string = "/services";
    public router: Router = Router();
    public serviceController: ServiceController = new ServiceController();

    constructor() { this.initializeRoutes(); }

    initializeRoutes(): void {
        const services = this.path;
        const {
            createService,
            editService,
            getServices,
            getUsersServices,
            getServicesForAdmin,
            getOneServiceForAdmin,
            activateService,
            deactivateService,
            blockService,
            unblockService,
            getOneService,
            getSaveList,
            setSaveList,
            deleteSaveList,
            addReviews,
            getReviews
        } = this.serviceController;

        this.router
            .route(`${services}`)
            .get(getServices)
            .post(protect, checkRoles([Role.SELLER]), ValidateBody(CreateSeviceBodyVal.safeParse), createService);

        this.router
            .route(`${services}/users`)
            .get(protect, checkRoles([Role.SELLER]), getUsersServices);

        this.router
            .route(`${services}/admin`)
            .get(protect, checkRoles([Role.ADMIN]), getServicesForAdmin);

        this.router
            .route(`${services}/:id/admin`)
            .get(protect, checkRoles([Role.ADMIN]), getOneServiceForAdmin);

        this.router
            .route(`${services}/save-list`)
            .get(protect, checkRoles([Role.BUYER]), getSaveList)
            .post(protect, checkRoles([Role.BUYER]), ValidateBody((AddSaveListBodyVal.safeParse)), setSaveList);

        this.router
            .route(`${services}/save-list/:id`)
            .delete(protect, checkRoles([Role.BUYER]), deleteSaveList);

        this.router
            .route(`${services}/:id/reviews`)
            .get(getReviews)
            .post(protect, checkRoles([Role.BUYER]), ValidateBody(AddReviewBodyVal.safeParse), addReviews);

        this.router
            .route(`${services}/:id/activate`)
            .patch(protect, checkRoles([Role.SELLER]), activateService);

        this.router
            .route(`${services}/:id/deactivate`)
            .patch(protect, checkRoles([Role.SELLER]), deactivateService);

        this.router
            .route(`${services}/:id/block`)
            .patch(protect, checkRoles([Role.ADMIN]), blockService);

        this.router
            .route(`${services}/:id/unblock`)
            .patch(protect, checkRoles([Role.ADMIN]), unblockService);

        this.router
            .route(`${services}/:id`)
            .get(getOneService)
            .put(protect, checkRoles([Role.SELLER]), ValidateBody(EditSeviceBodyVal.safeParse), editService);
    }

}