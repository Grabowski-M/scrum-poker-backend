const { STATE_CHANGE, RESET_CARDS } = require('../constants/eventTypes');

const handleStartVoting = ({ io, roomsStore }) => ({ socket }) => {
  const roomId = roomsStore.getRoomIdForSocketId(socket.id);
  roomsStore.startRoomVoting(roomId);

  io.to(roomId).emit(STATE_CHANGE, roomsStore.getRoom(roomId));
  io.to(roomId).emit(RESET_CARDS);
  io.emit(STATE_CHANGE, roomsStore.getRoom(roomId));
};

module.exports = handleStartVoting;
