import express, { Application, json, urlencoded } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { Routes } from './interface';
import { Mode } from './util';
import { errorMiddleware } from './middleware/error.middleware';
import { createConnection } from './config';

export class App {
    private app: Application = express();

    constructor(
        routes: Routes[]
    ) {
        this.connectDatabase();
        this.initializeMiddleware();
        this.initializeRoutes(routes);
        this.initializeErrorHandling();
    }

    getServer() {
        this.app;
    }

    private connectDatabase(): void {
        createConnection(process.env.MONGODB_URI);
    }

    private initializeMiddleware(): void {
        this.makeDevDependancy(morgan('dev'));
        this.app.use(cors({ methods: "*", origin: "*" }));
        this.app.use(json({ limit: process.env.BODY_LIMIT }));
        this.app.use(urlencoded({
            extended: true,
            limit: process.env.BODY_LIMIT
        }));
    }

    private makeDevDependancy(middleware: any) {
        process.env.NODE_ENV === Mode.DEV && this.app.use(middleware);
    };

    private initializeRoutes(routes: Routes[]) {
        routes.forEach((route: any) =>
            this.app.use(route.router)
        );
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    public listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`=================================`);
            console.log(`======= ENV: ${process.env.NODE_ENV} =======`);
            console.log(`App listening on the port ${process.env.PORT}`);
            console.log(`=================================`);
        });
    }
}