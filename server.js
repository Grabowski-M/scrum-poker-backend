const app = require('express')();
const httpServer = require('http').createServer(app);
const socketIo = require('socket.io');

const {
  ROOM_CONNECT,
  STATE_CHANGE,
  TIMER_CHANGE,
  CARD_CHANGE,
  SHOW_CARDS,
  START_VOTING,
  STOP_VOTING,
  RESET_CARDS,
  PROMOTE_TO_LEADER,
} = require('./src/room/constants/eventTypes');
const { createRoomsStore } = require('./src/room/store');
const {
  handleRoomConnection,
  handleTimerChange,
  handleCardChange,
  handlePromoteToLeader,
} = require('./src/room/repositories');

const options = {
  cors: {
    origin: ['http://localhost:8080', 'https://game.scrum-poker.tech'],
    methods: ['GET', 'POST'],
  },
};
const io = socketIo(httpServer, options);

app.use('/health', (req, res) => res.send('This is fine'));

const roomsStore = createRoomsStore();

io.on('connection', (socket) => {
  socket.on(ROOM_CONNECT, (payload) => handleRoomConnection({ roomsStore, io })({
    socket, payload,
  }));
  socket.on(TIMER_CHANGE, (payload) => handleTimerChange({ roomsStore, io })({ socket, payload }));
  socket.on(CARD_CHANGE, (payload) => handleCardChange({ roomsStore, io })({ socket, payload }));
  socket.on(PROMOTE_TO_LEADER, (payload) => handlePromoteToLeader({ roomsStore, io })({
    socket, payload,
  }));
  socket.on(START_VOTING, () => {
    const roomId = roomsStore.getRoomIdForSocketId(socket.id);
    roomsStore.startRoomVoting(roomId);

    io.to(roomId).emit(STATE_CHANGE, roomsStore.getRoom(roomId));
    io.to(roomId).emit(RESET_CARDS);
    io.emit(STATE_CHANGE, roomsStore.getRoom(roomId));
  });
  socket.on(STOP_VOTING, () => {
    const roomId = roomsStore.getRoomIdForSocketId(socket.id);

    io.to(roomId).emit(SHOW_CARDS, roomsStore.getRoomCards(roomId));
    roomsStore.stopRoomVoting(roomId);
    io.to(roomId).emit(STATE_CHANGE, roomsStore.getRoom(roomId));
  });
  socket.on('disconnect', () => {
    const roomId = roomsStore.leaveRoom({ socketId: socket.id });

    if (roomId) {
      io.to(roomId).emit(STATE_CHANGE, roomsStore.getRoom(roomId));
    }
  });
});

httpServer.listen(process.env.PORT || 3011);
