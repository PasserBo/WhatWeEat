import * as express from "express";
import * as http from "http";
import { Server } from "socket.io";
import * as cors from "cors";
import { restaurants } from "./data";
import { createRoom, joinRoom, startVoting, submitVote, getResults, getRoomState, getVoteCount, restartRoom, rooms } from "./rooms";

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

    socket.on("createRoom",({roomId, maxPlayers, emojiPassword}) => {
        createRoom(roomId, maxPlayers, socket.id, restaurants, emojiPassword);
        socket.join(roomId);
        const room = getRoomState(roomId);
        io.to(roomId).emit("roomUpdate", room);
    });

    socket.on("joinRoom",({roomId}) => {
        console.log(`Player ${socket.id} joining room ${roomId}`);
        if (joinRoom(roomId, socket.id)) {
            socket.join(roomId);
            const room = getRoomState(roomId);
            console.log(`Room state after join:`, room);
            io.to(roomId).emit("roomUpdate", room);
        } else {
            console.log(`Failed to join room ${roomId}`);
        }
    });
    
    socket.on("getAvailableRooms", () => {
        const availableRooms = Object.values(rooms).filter(room => room.status === "waiting");
        socket.emit("availableRooms", availableRooms);
    });

    socket.on("getEmojiOptions", (roomId) => {
        const room = rooms[roomId];
        if (room) {
            socket.emit("emojiOptions", room.emojiOptions);
        }
    });

    socket.on("startVoting",(roomId) => {
        console.log(`Starting voting for room ${roomId}`);
        const room = rooms[roomId];
        if (room) {
            // Update room status
            room.status = "voting";
            
            // First emit room update to all players
            io.to(roomId).emit("roomUpdate", getRoomState(roomId));
            
            // Then emit the first restaurant
            const restaurant = startVoting(roomId);
            if (restaurant) {
                io.to(roomId).emit("newRestaurant", restaurant);
                io.to(roomId).emit("voteUpdate", 0);
            }
        }
    });

    socket.on("vote",(roomId, restaurantId, score) => {
        const result = submitVote(roomId, restaurantId, score);
        const currentVotes = getVoteCount(roomId);
        io.to(roomId).emit("voteUpdate", currentVotes);
        const room = rooms[roomId];

        if (result === "FINISHED") {
            room.status = "finished";
            io.to(roomId).emit("roomUpdate", getRoomState(roomId));
            io.to(roomId).emit("results", getResults(roomId));
        } else if(result) {
            io.to(roomId).emit("newRestaurant", result);
            io.to(roomId).emit("voteUpdate", 0);  // Reset vote count for new restaurant
        }
    });

    socket.on("restart", (roomId) => {
        // 如果房间不存在，返回
        const room = rooms[roomId];
        if (!room) return;

        // Track restart votes
        if (!room.votes['restart']) {
            room.votes['restart'] = [];
        }
        room.votes['restart'].push(1); // 1 means want to restart
        room.currentVotes.set('restart', room.votes['restart'].length);
        // 更新投票人数
        const currentVotes = getVoteCount(roomId);
        io.to(roomId).emit("voteUpdate", currentVotes);

        // Check if everyone wants to restart
        if (room.votes['restart'].length >= room.players.length) {
            // Use function restartRoom
            // Set status to voting
            // Clear results
            // Clear votes
            // Clear current restaurant index
            restartRoom(roomId);
            const restaurant = startVoting(roomId);
            // 如果餐厅存在，则更新餐厅
            if (restaurant) {
                io.to(roomId).emit("newRestaurant", restaurant);
                io.to(roomId).emit("voteUpdate", 0);
                io.to(roomId).emit("status", "voting");
                io.to(roomId).emit("results", null); // Clear results
            }
        }
    });

    socket.on("disconnect", () => {
        console.log("用户断开连接");
    });
});

server.listen(3001, "0.0.0.0", () => console.log("后端运行在 3001 端口"));
