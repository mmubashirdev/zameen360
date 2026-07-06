import { io } from "socket.io-client";
import { SOCKET_URL } from "@shared/config/api";

const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  transports: ["websocket", "polling"],
});

export default socket;