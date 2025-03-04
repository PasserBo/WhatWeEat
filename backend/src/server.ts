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

const resetGame = () => {
    currentIndex = 0;
    votes = {};
    usersCompleted = 0;
};


let currentIndex = 0;
let votes: Record<string, number[]> = {};
let usersCompleted = 0;

io.on("connection", (socket) => {
    console.log("用户连接");

    if (currentIndex >= 10) {
        resetGame();
    }

    socket.emit("restaurant", { restaurant: restaurants[currentIndex] });

    socket.on("vote", (data: Vote) => {
        if (!votes[data.id]) votes[data.id] = [];
        votes[data.id].push(data.score);
        usersCompleted++;

        if (usersCompleted >= 3) {  // 3 人投票后切换
            currentIndex++;
            usersCompleted = 0;

            if (currentIndex < 10) {
                io.emit("restaurant", { restaurant: restaurants[currentIndex] });
            } else {
                const resultsArray = restaurants.map((r) => ({
                    ...r,
                    averageScore: votes[r.id]
                        ? (votes[r.id].reduce((a, b) => a + b, 0) / votes[r.id].length).toFixed(2)
                        : "N/A"
                }))
                .filter((r) => r.averageScore !== "N/A") // 过滤没有评分的餐厅
                .sort((a, b) => Number(b.averageScore) - Number(a.averageScore)) // 按评分降序排列
                .slice(0, 10);
                io.emit("results", resultsArray); // 确保发送的是数组
            }

        }

        // 发送当前已提交投票数
        io.emit("voteProgress", usersCompleted);
    });

    socket.on("restart", ()=>{
        resetGame();
        io.emit("restaurant", {restaurant: restaurants[currentIndex] });

    });

    socket.on("disconnect", () => {
        console.log("用户断开连接");
    });
});



server.listen(3001, "0.0.0.0", () => console.log("后端运行在 3001 端口"));
