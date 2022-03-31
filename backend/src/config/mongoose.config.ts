import { connect, connection } from "mongoose";

export const createConnection = (uri: any) => {
    connection
        .on('connecting', () => {
            console.log(' [ MongoDB ] connecting... ');
        })
        .on('connected', () => {
            console.log(' [ MongoDB ] connected ');
        })
        .on('disconnecting', () => {
            console.log(' [ MongoDB ] disconnecting... ');
        })
        .on('disconnected', () => {
            console.log(' [ MongoDB ] disconnected ');
        })
        .on('error', (err) => {
            console.log(' [ MongoDB ] error ');
            console.error(err);
        });

    connect(`${uri}`);
};