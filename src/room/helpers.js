const roles = require('./constants/roles');

const getParticipantInitialState = ({ username, socketId, role = roles.PARTICIPANT }) => ({
  socketId,
  username,
  role,
  card: null,
});

const getRoomInitialState = ({ roomId, user }) => ({
  roomId,
  showCards: false,
  votingStarted: false,
  participants: [user],
  timer: null,
});

module.exports = {
  getRoomInitialState,
  getParticipantInitialState,
};
