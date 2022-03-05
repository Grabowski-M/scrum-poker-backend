const { SHOW_CARDS, STATE_CHANGE } = require('../constants/eventTypes');

module.exports = ({ io, roomsStore }) => ({ socket, payload }) => {
  const roomId = roomsStore.getRoomIdForSocketId(socket.id);
  const { card } = payload;
  roomsStore.changeCard({ socketId: socket.id, card });

  if (roomsStore.shouldShowCards({ roomId })) {
    roomsStore.stopRoomVoting(roomId);
    io.to(roomId).emit(SHOW_CARDS, roomsStore.getRoomCards(roomId));
    io.to(roomId).emit(STATE_CHANGE, roomsStore.getRoom(roomId));
  }
};
