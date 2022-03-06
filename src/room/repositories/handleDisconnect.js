const { STATE_CHANGE } = require('../constants/eventTypes');

const handleDisconnect = ({ io, roomsStore }) => ({ socket }) => {
  const roomId = roomsStore.leaveRoom({ socketId: socket.id });

  if (roomId) {
    io.to(roomId).emit(STATE_CHANGE, roomsStore.getRoom(roomId));
  }
};

module.exports = handleDisconnect;
