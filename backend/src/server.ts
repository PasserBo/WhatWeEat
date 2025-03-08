import * as express from "express";
import * as http from "http";
import { Server } from "socket.io";
import * as cors from "cors";
import { restaurants } from "./data";
import { createRoom, joinRoom, startVoting, submitVote, getResults } from "./rooms";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

io.on("connection", (socket) => {
    console.log("用户连接");

    socket.on("createRoom",({roomId, maxPlayers}) => {
        createRoom(roomId, maxPlayers, socket.id, restaurants);
        socket.join(roomId);
        io.to(roomId).emit("roomUpdate", {roomId, maxPlayers });
    });

    socket.on("joinRoom",({roomId}) => {
        if (joinRoom(roomId, socket.id)) {
            socket.join(roomId);
            io.to(roomId).emit("roomUpdate", {roomId});
        }
    });

    socket.on("startVoting",(roomId) => {
        const restaurant = startVoting(roomId);
        if (restaurant) {
            io.to(roomId).emit("newRestaurant",restaurant);
        }
    });

    socket.on("vote",(roomId, restaurantId, score) => {
        const nextRestaurant = submitVote(roomId, restaurantId, score);
        if (nextRestaurant === "FINISHED") {
            io.to(roomId).emit("results",getResults(roomId));
        } else if(nextRestaurant) {
            io.to(roomId).emit("newRestaurant",nextRestaurant);
        }
    });



    socket.on("disconnect", () => {
        console.log("用户断开连接");
    });
});



server.listen(3001, "0.0.0.0", () => console.log("后端运行在 3001 端口"));
