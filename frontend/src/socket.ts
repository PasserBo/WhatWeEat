import io from "socket.io-client";

// Create a single socket instance that will be shared across components
const socket = io("https://whatweeat.onrender.com", { transports: ["websocket"] });

// Log socket connection events for debugging
socket.on("connect", () => {
    console.log("Socket connected with ID:", socket.id);
});

socket.on("disconnect", () => {
    console.log("Socket disconnected");
});

export default socket; 