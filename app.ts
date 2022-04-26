import http, { Server } from 'http';
import express, { Application, json, urlencoded } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import { Mode } from './util';
import { Routes } from './interface';
import { createConnection, connectRedis, configFirebase, configPaypal } from './config';
import { errorMiddleware } from './middleware/error.middleware';
import { SetupSocketIo } from './socket';

export class App {
    private app: Application = express();
    private server: Server = http.createServer(this.app);

    constructor(routes: Routes[], setupSocketIo: SetupSocketIo) {
        this.setUpConfigs();
        this.connectSocketIo(setupSocketIo);
        this.connectDatabase();
        this.initializeMiddleware();
        this.initializeRoutes(routes);
        this.initializeErrorHandling();
    }

    private setUpConfigs(): void {
        configPaypal();
        configFirebase();
    }

    private connectDatabase(): void {
        connectRedis();
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
        this.app.use(compression({
            level: 6,
            threshold: 1024 * 10
        }));
    }

    private initializeRoutes(routes: Routes[]) {
        routes.forEach((route: any) =>
            this.app.use('/api', route.router)
        );
    }

    private connectSocketIo(setupSocketIo: SetupSocketIo): void {
        setupSocketIo(this.server);
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    public listen() {
        this.server.listen(process.env.PORT, () => {
            console.log(`=================================`.green);
            console.log(`======= ENV: ${process.env.NODE_ENV} =======`.green);
            console.log(`App listening on the port ${process.env.PORT}`.green);
            console.log(`=================================`.green);
        });
    }

    private makeDevDependancy(middleware: any) {
        process.env.NODE_ENV === Mode.DEV && this.app.use(middleware);
    };
}