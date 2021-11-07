const app = require('express')();
const httpServer = require('http').createServer(app);
const socketIo = require('socket.io');

const { ROOM_CONNECT, STATE_CHANGE } = require('./src/room/constants/eventTypes');
const { createRoomsStore } = require('./src/room/store');

const options = {
  cors: {
    origin: 'http://localhost:8081',
    methods: ['GET', 'POST'],
  },
};
const io = socketIo(httpServer, options);

const roomsStore = createRoomsStore();

const createRoom = ({ socket, roomId, username }) => {
  console.log('\x1b[36m%s\x1b[0m', `Creating room ${roomId}`); // eslint-disable-line
  socket.join(roomId);

  roomsStore.createRoom({ roomId, username, socketId: socket.id });

  socket.to(roomId).emit(STATE_CHANGE, roomsStore.getRoom(roomId));
  socket.emit(STATE_CHANGE, roomsStore.getRoom(roomId));
};

const joinRoom = ({ socket, roomId, username }) => {
  console.log('\x1b[36m%s\x1b[0m', `${username ? username : 'UNKNOWN'} joining room ${roomId}`); // eslint-disable-line
  socket.join(roomId);

  roomsStore.joinRoom({ roomId, username, socketId: socket.id });

  socket.to(roomId).emit(STATE_CHANGE, roomsStore.getRoom(roomId));
  socket.emit(STATE_CHANGE, roomsStore.getRoom(roomId));
};

const handleRoomConnection = ({ socket, payload }) => {
  const { roomId, username } = payload;

  if (roomsStore.roomExists(roomId)) {
    joinRoom({ socket, roomId, username });
  } else {
    createRoom({ socket, roomId, username });
  }
};

io.on('connection', (socket) => {
  socket.on(ROOM_CONNECT, (payload) => handleRoomConnection({ socket, payload }));
  socket.on('disconnect', () => {
    const roomId = roomsStore.leaveRoom({ socketId: socket.id });

    if (roomId) {
      socket.to(roomId).emit(STATE_CHANGE, roomsStore.getRoom(roomId));
    }
  });
});

httpServer.listen(3011);
