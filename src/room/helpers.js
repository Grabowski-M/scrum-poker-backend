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
  timer: null,
});

module.exports = {
  getRoomInitialState,
  getParticipantInitialState,
};
