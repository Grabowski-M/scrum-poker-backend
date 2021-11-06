const app = require('express')();
const httpServer = require('http').createServer(app);
const socketIo = require('socket.io');

const roles = require('./src/constants/roles');
const { ROOM_CONNECT, STATE_CHANGE } = require('./src/constants/eventTypes');

const options = {
  cors: {
    origin: 'http://localhost:8081',
    methods: ['GET', 'POST'],
  },
};
const io = socketIo(httpServer, options);

const getNewParticipantInitialState = ({ username, socketId, role = roles.PARTICIPANT }) => ({
  socketId,
  username,
  role,
});

const getNewRoomInitialState = ({ roomId, user }) => ({
  roomId,
  showCards: false,
  votingStarted: false,
  participants: [user],
  timer: null,
});

const rooms = {};

const roomExists = ({ roomId }) => !!rooms[roomId];

const createRoom = ({ socket, roomId, username }) => {
  console.log('\x1b[36m%s\x1b[0m', `Creating room ${roomId}`); // eslint-disable-line
  socket.join(roomId);

  rooms[roomId] = getNewRoomInitialState({
    roomId,
    user: getNewParticipantInitialState({ username, role: roles.LEADER, socketId: socket.id }),
  });

  socket.to(roomId).emit(STATE_CHANGE, rooms[roomId]);
  socket.emit(STATE_CHANGE, rooms[roomId]);
};

const joinRoom = ({
  socket, roomId, username,
}) => {
  console.log('\x1b[36m%s\x1b[0m', `${username ? username : 'UNKNOWN'} joining room ${roomId}`); // eslint-disable-line
  socket.join(roomId);

  rooms[roomId].participants.push(getNewParticipantInitialState({ username, socketId: socket.id }));
  socket.to(roomId).emit(STATE_CHANGE, rooms[roomId]);
  socket.emit(STATE_CHANGE, rooms[roomId]);
};

const handleRoomConnection = ({ socket, payload }) => {
  const { roomId, username } = payload;

  if (roomExists({ socket, roomId })) {
    joinRoom({ socket, roomId, username });
  } else {
    createRoom({ socket, roomId, username });
  }
};

io.on('connection', (socket) => {
  socket.on(ROOM_CONNECT, (payload) => handleRoomConnection({ socket, payload }));
  socket.on('disconnect', () => {});
});

httpServer.listen(3011);
