const { STATE_CHANGE } = require('../constants/eventTypes');

module.exports = ({ io, roomsStore }) => ({ socket, payload }) => {
  const roomId = roomsStore.getRoomIdForSocketId(socket.id);
  const { participantId } = payload;

  roomsStore.changeLeader({ roomId, participantId });
  io.to(roomId).emit(STATE_CHANGE, roomsStore.getRoom(roomId));
};
