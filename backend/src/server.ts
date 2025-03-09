import * as express from "express";
import * as http from "http";
import { Server } from "socket.io";
import * as cors from "cors";
import { restaurants } from "./data";
import { createRoom, joinRoom, startVoting, submitVote, getResults, getRoomState, getVoteCount } from "./rooms";

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
        io.to(roomId).emit("roomUpdate", {
            roomId,
            owner: socket.id,
            players: [socket.id],
            status: 'waiting',
            maxPlayers
        });
    });

    socket.on("joinRoom",({roomId}) => {
        if (joinRoom(roomId, socket.id)) {
            socket.join(roomId);
            const room = getRoomState(roomId);
            io.to(roomId).emit("roomUpdate", room);
        }
    });

    socket.on("startVoting",(roomId) => {
        const restaurant = startVoting(roomId);
        if (restaurant) {
            io.to(roomId).emit("newRestaurant", restaurant);
            io.to(roomId).emit("voteUpdate", 0);
        }
    });

    socket.on("vote",(roomId, restaurantId, score) => {
        const result = submitVote(roomId, restaurantId, score);
        const currentVotes = getVoteCount(roomId);
        io.to(roomId).emit("voteUpdate", currentVotes);

        if (result === "FINISHED") {
            io.to(roomId).emit("results", getResults(roomId));
        } else if(result) {
            io.to(roomId).emit("newRestaurant", result);
            io.to(roomId).emit("voteUpdate", 0);
        }
    });

    socket.on("disconnect", () => {
        console.log("用户断开连接");
    });
});

server.listen(3001, "0.0.0.0", () => console.log("后端运行在 3001 端口"));
