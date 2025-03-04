import * as express from "express";
import * as http from "http";
import { Server } from "socket.io";
import * as cors from "cors";
import { restaurants } from "./data";
import { Vote } from "./types";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let currentIndex = 0;
let votes: Record<string, number[]> = {};
let usersCompleted = 0;

io.on("connection", (socket) => {
    console.log("用户连接");

    socket.emit("restaurant", { restaurant: restaurants[currentIndex] });

    socket.on("vote", (data: Vote) => {
        if (!votes[data.id]) votes[data.id] = [];
        votes[data.id].push(data.score);
        usersCompleted++;

        if (usersCompleted >= 3) {
            currentIndex++;
            usersCompleted = 0;

            if (currentIndex < 10) {
                io.emit("restaurant", { restaurant: restaurants[currentIndex] });
            } else {
                io.emit("results", votes);
            }
        }
    });

    socket.on("disconnect", () => {
        console.log("用户断开连接");
    });
});

server.listen(3001, "0.0.0.0", () => console.log("后端运行在 3001 端口"));
