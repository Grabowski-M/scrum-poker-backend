// @ts-nocheck

const getParticipantInitialState = ({ username, socketId }) => ({
  socketId,
  username,
});

const getRoomInitialState = ({ roomId, user }) => ({
  roomId,
  showCards: false,
  voting: false,
  participants: [user],
  leader: user.socketId,
  targetTime: null,
  availableCards: [0, 0.5, 1, 2, 3, 5, 8, 13],
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
