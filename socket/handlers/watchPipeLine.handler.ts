import { Events } from "../socket.enum";
import { CustomSocket } from "../schema/socket.interface";
import { Chat, Lancer, Message, Order, Service, User } from "../../models";
import { redis } from "../../config";
import { IO } from "../schema/socket.type";

export const addWatchPipelineForAdmin = (socket: CustomSocket) => {
    Lancer.watch([], { fullDocument: "updateLookup" })
        .on("change", (data) => {
            socket.emit(Events.LANCER, data.fullDocument);
        });

    User.watch([{
        $match: { operationType: "insert" },
    }]).on("change", async () => {
        try {
            const totalUsers = await User.countDocuments();
            socket.emit(Events.NEW_COUNT, { totalUsers });
        } catch (err) {
            console.log(err);
        }
    });

    Order.watch([{
        $match: { operationType: "insert" },
    }]).on("change", async () => {
        try {
            const totalOrders = await Order.countDocuments();
            socket.emit(Events.NEW_COUNT, { totalOrders });
        } catch (err) {
            console.log(err);
        }
    });

    Service.watch([{
        $match: { operationType: "insert" },
    }]).on("change", async () => {
        try {
            const totalService = await Service.countDocuments();
            socket.emit(Events.NEW_COUNT, { totalService });
        } catch (err) {
            console.log(err);
        }
    });

    Chat.watch([{
        $match: { operationType: "insert" },
    }]).on("change", async () => {
        try {
            const totalChat = await Chat.countDocuments();
            socket.emit(Events.NEW_COUNT, { totalChat });
        } catch (err) {
            console.log(err);
        }
    });
};


export const addWatchPipelineForUser = (io:IO, socket: CustomSocket) => {
    Message.watch([{
        $match: { operationType: "insert" },
    }]).on("change", async (data) => {
        const doc = data.fullDocument;
        try {
            const senderId = await redis.get(doc.receiver.toString());
            
            if (senderId)
                io.to(senderId).emit(`${Events.MESSAGE}/${doc.chat}`, doc);
        } catch (err) {
            console.log(err)
        }
    })
};
