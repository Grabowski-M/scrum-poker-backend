const app = require('express')();
const httpServer = require('http').createServer(app);
const socketIo = require('socket.io');

const {
  ROOM_CONNECT, STATE_CHANGE, TIMER_CHANGE,
} = require('./src/room/constants/eventTypes');
const { createRoomsStore } = require('./src/room/store');
const { handleRoomConnection } = require('./src/room/repositories');

const options = {
  cors: {
    origin: 'http://localhost:8080',
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
  socket.on(TIMER_CHANGE, (payload) => {
    const { time } = payload;
    const roomId = roomsStore.getRoomIdForSocketId(socket.id);
    const roomInStore = roomsStore.getRoom(roomId);

    if (time) {
      const now = new Date();

      roomInStore.targetTime = new Date(now.getTime() + time * 60 * 1000);
    } else {
      roomInStore.targetTime = null;
    }

    socket.to(roomId).emit(STATE_CHANGE, roomInStore);
    socket.emit(STATE_CHANGE, roomInStore);
  });
});

httpServer.listen(3011);
