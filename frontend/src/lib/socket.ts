// import { Manager } from "socket.io-client";
import io from "socket.io-client";
// import { Restaurant, RoomState } from "@/types";
// import { useNavigate } from "react-router-dom";
// let socket: ReturnType<typeof Manager.prototype.socket> | null = null;
// const navigate = useNavigate();

const socket = io("https://whatweeat.onrender.com", { transports: ["websocket"] });

socket.on("connect", () => {
  console.log("Connected to server with ID:", socket?.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

export default socket;
