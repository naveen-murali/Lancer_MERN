import { connect, connection } from "mongoose";

export const createConnection = (uri: any) => {
    connection
        .on("connecting", () => {
            console.log(" [ MongoDB ] connecting...".yellow.dim);
        })
        .on("connected", () => {
            console.log(" [ MongoDB ] connected".green);
        })
        .on("disconnecting", () => {
            console.log(" [ MongoDB ] disconnecting...".red.dim);
        })
        .on("disconnected", () => {
            console.log(" [ MongoDB ] disconnected".red.dim);
        })
        .on("error", (err) => {
            console.log(" [ MongoDB ] error".red);
            console.error(err);
        });

    connect(`${uri}`);
};
