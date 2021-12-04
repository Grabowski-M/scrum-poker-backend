const app = require('express')();
const httpServer = require('http').createServer(app);
const socketIo = require('socket.io');

const {
  ROOM_CONNECT, STATE_CHANGE, TIMER_CHANGE, CARD_CHANGE, SHOW_CARDS, START_VOTING, STOP_VOTING,
} = require('./src/room/constants/eventTypes');
const { createRoomsStore } = require('./src/room/store');
const { handleRoomConnection, handleTimerChange } = require('./src/room/repositories');

const options = {
  cors: {
    origin: 'http://localhost:8081',
    methods: ['GET', 'POST'],
  },
};
const io = socketIo(httpServer, options);

const roomsStore = createRoomsStore();

io.on('connection', (socket) => {
  socket.on(ROOM_CONNECT, (payload) => handleRoomConnection({ roomsStore })({ socket, payload }));
  socket.on(TIMER_CHANGE, (payload) => handleTimerChange({ roomsStore })({ socket, payload }));
  socket.on(CARD_CHANGE, (payload) => {
    const roomId = roomsStore.getRoomIdForSocketId(socket.id);
    const { card } = payload;
    const shouldShowCards = roomsStore.changeCard({ socketId: socket.id, card });

    if (shouldShowCards) {
      socket.to(roomId).emit(SHOW_CARDS, roomsStore.getRoomCards(roomId));
      socket.emit(SHOW_CARDS, roomsStore.getRoomCards(roomId));
      roomsStore.stopRoomVoting(roomId);
      socket.to(roomId).emit(STATE_CHANGE, roomsStore.getRoom(roomId));
      socket.emit(STATE_CHANGE, roomsStore.getRoom(roomId));
    }
  });
  socket.on(START_VOTING, () => {
    const roomId = roomsStore.getRoomIdForSocketId(socket.id);
    roomsStore.startRoomVoting(roomId);

    socket.to(roomId).emit(STATE_CHANGE, roomsStore.getRoom(roomId));
    socket.emit(STATE_CHANGE, roomsStore.getRoom(roomId));
  });
  socket.on(STOP_VOTING, () => {
    const roomId = roomsStore.getRoomIdForSocketId(socket.id);
    roomsStore.stopRoomVoting(roomId);

    socket.to(roomId).emit(STATE_CHANGE, roomsStore.getRoom(roomId));
    socket.emit(STATE_CHANGE, roomsStore.getRoom(roomId));
  });
  socket.on('disconnect', () => {
    const roomId = roomsStore.leaveRoom({ socketId: socket.id });

    if (roomId) {
      socket.to(roomId).emit(STATE_CHANGE, roomsStore.getRoom(roomId));
    }
  });
});

httpServer.listen(3011);
