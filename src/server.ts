import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import { eventTypes } from './room/constants/eventTypes';
import { createRoomsStore } from './room/store';
import {
  handleCardChange,
  handleDisconnect,
  handlePromoteToLeader,
  handleRoomConnection,
  handleStartVoting,
  handleStopVoting,
  handleTimerChange,
} from './room/repositories';

import { ClientToServerEvents, ServerToClientEvents, SocketData } from './types/events';

const app = express();

app.use(cors());
const httpServer = http.createServer(app);

const options = {
  cors: {
    origin: ['http://localhost:8080', 'https://game.scrum-poker.tech'],
    methods: ['GET', 'POST'],
  },
};
// const io = socketIo(httpServer, options);
const io = new Server<ClientToServerEvents, ServerToClientEvents, SocketData>(
  httpServer,
  options
);

app.use('/health', (req, res) => res.send('This is fine'));

const roomsStore = createRoomsStore();

io.on('connection', (socket) => {
  socket.on(eventTypes.ROOM_CONNECT, (payload) =>
    handleRoomConnection({ roomsStore, io })({ socket, payload })
  );
  socket.on(eventTypes.TIMER_CHANGE, (payload) =>
    handleTimerChange({ roomsStore, io })({ socket, payload })
  );
  socket.on(eventTypes.CARD_CHANGE, (payload) =>
    handleCardChange({ roomsStore, io })({ socket, payload })
  );
  socket.on(eventTypes.PROMOTE_TO_LEADER, (payload) =>
    handlePromoteToLeader({ roomsStore, io })({ socket, payload })
  );
  socket.on(eventTypes.START_VOTING, () =>
    handleStartVoting({ roomsStore, io })({ socket })
  );
  socket.on(eventTypes.STOP_VOTING, () =>
    handleStopVoting({ roomsStore, io })({ socket })
  );
  socket.on(eventTypes.DISCONNECT, () =>
    handleDisconnect({ roomsStore, io })({ socket })
  );
});

httpServer.listen(process.env.PORT || 3011);
