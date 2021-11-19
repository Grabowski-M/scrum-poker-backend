const getParticipantInitialState = ({ username, socketId }) => ({
  socketId,
  username,
  card: null,
});

const getRoomInitialState = ({ roomId, user }) => ({
  roomId,
  showCards: false,
  votingStarted: false,
  participants: [user],
  leader: user.socketId,
  targetTime: null,
});

const isSocketInRoom = ({
  roomsStore,
  socket,
  roomId,
}) => roomsStore.getRoomIdForSocketId(socket.id) === roomId;

module.exports = {
  getRoomInitialState,
  getParticipantInitialState,
  isSocketInRoom,
};
