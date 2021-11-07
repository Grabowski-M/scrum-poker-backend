const app = require('express')();
const httpServer = require('http').createServer(app);
const socketIo = require('socket.io');

const { ROOM_CONNECT, STATE_CHANGE } = require('./src/room/constants/eventTypes');
const { createRoomsStore } = require('./src/room/store');
const { handleRoomConnection } = require('./src/room/repositories');

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
  socket.on('disconnect', () => {
    const roomId = roomsStore.leaveRoom({ socketId: socket.id });

    if (roomId) {
      socket.to(roomId).emit(STATE_CHANGE, roomsStore.getRoom(roomId));
    }
  });
});

httpServer.listen(3011);
