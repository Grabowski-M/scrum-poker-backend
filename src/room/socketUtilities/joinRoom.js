const { STATE_CHANGE } = require('../constants/eventTypes');

module.exports = ({ socket, roomId, roomInStore }) => {
  console.log('\x1b[36m%s\x1b[0m', `${socket.id} joining room ${roomId}`); // eslint-disable-line

  socket.join(roomId);
  socket.to(roomId).emit(STATE_CHANGE, roomInStore);
  socket.emit(STATE_CHANGE, roomInStore);
};
