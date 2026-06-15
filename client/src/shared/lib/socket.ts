import { io } from "socket.io-client";

const envUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const SOCKET_URL = envUrl.replace(/\/api\/?$/, "");

const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  transports: ["websocket", "polling"],
});

export default socket;