const app = require('express')();
const cors = require('cors');

app.use(cors());
const httpServer = require('http').createServer(app);
const socketIo = require('socket.io');

const {
  ROOM_CONNECT,
  TIMER_CHANGE,
  CARD_CHANGE,
  START_VOTING,
  STOP_VOTING,
  PROMOTE_TO_LEADER,
} = require('./src/room/constants/eventTypes');
const { createRoomsStore } = require('./src/room/store');
const {
  handleRoomConnection,
  handleTimerChange,
  handleCardChange,
  handlePromoteToLeader,
  handleStartVoting,
  handleStopVoting,
  handleDisconnect,
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
  socket.on(ROOM_CONNECT,
    (payload) => handleRoomConnection({ roomsStore, io })({ socket, payload }));
  socket.on(TIMER_CHANGE, (payload) => handleTimerChange({ roomsStore, io })({ socket, payload }));
  socket.on(CARD_CHANGE, (payload) => handleCardChange({ roomsStore, io })({ socket, payload }));
  socket.on(PROMOTE_TO_LEADER,
    (payload) => handlePromoteToLeader({ roomsStore, io })({ socket, payload }));
  socket.on(START_VOTING, () => handleStartVoting({ roomsStore, io })({ socket }));
  socket.on(STOP_VOTING, () => handleStopVoting({ roomsStore, io })({ socket }));
  socket.on('disconnect', () => handleDisconnect({ roomsStore, io })({ socket }));
});

httpServer.listen(process.env.PORT || 3011);
