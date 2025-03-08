import { useState } from "react";
import { Box, Input, Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("https://whatweeat.onrender.com", { transports: ["websocket"] });

const Home = () => {
    const [roomId, setRoomId] = useState("");
    const navigate = useNavigate();

    const createRoom = () => {
        const newRoomId = Math.random().toString(36).substring(7);
        socket.emit("createRoom", { roomId: newRoomId, maxPlayers: 3 });
        navigate(`/room/${newRoomId}`);
    };

    const joinRoom = () => {
        socket.emit("joinRoom", { roomId });
        navigate(`/room/${roomId}`);
    };

    return (
        <Box textAlign="center">
        <Text fontSize="2xl">创建或加入房间</Text>
            <Button onClick={createRoom} colorScheme="blue" m={2}>创建房间</Button>
        <Input placeholder="输入房间 ID" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
    <Button onClick={joinRoom} colorScheme="green" m={2}>加入房间</Button>
        </Box>
);
};

export default Home;
