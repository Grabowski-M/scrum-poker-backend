import {ClientToServerEvents, ServerToClientEvents, SocketData} from "./events";
import {Socket} from "socket.io";

declare global {
    type io = Socket<
        ClientToServerEvents,
        ServerToClientEvents,
        SocketData
        >
}
