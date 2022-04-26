import { Router } from 'express';
import { LancerController } from '../controllers';
import { Routes } from "../interface";
import { checkRoles, protect, ValidateBody } from '../middleware';
import { Role } from '../util';
import { UpdateLancerBodyVal } from '../validation';

export class LancerRoutes implements Routes {
    public path: string = "/lancer";
    public router: Router = Router();
    private lancerController: LancerController = new LancerController();

    constructor() { this.initializeRoutes(); }

    initializeRoutes(): void {
        const lancer = this.path;

        const {
            getLancer,
            updateLancer,
            getLancersCounts,
        } = this.lancerController;

        this.router
            .route(`${lancer}`)
            .get(protect, checkRoles([Role.ADMIN]), getLancer)
            .put(protect, checkRoles([Role.ADMIN]), ValidateBody(UpdateLancerBodyVal.safeParse), updateLancer);

        this.router
            .route(`${lancer}/counts`)
            .get(protect, checkRoles([Role.ADMIN]), getLancersCounts);
    }

}