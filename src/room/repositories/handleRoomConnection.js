const socketUtilities = require('../socketUtilities');

module.exports = ({ roomsStore }) => ({ socket, payload }) => {
  const { roomId, username } = payload;

  if (roomsStore.roomExists(roomId)) {
    roomsStore.joinRoom({ roomId, username, socketId: socket.id });
    socketUtilities.joinRoom({ socket, roomId, roomInStore: roomsStore.getRoom(roomId) });
  } else {
    roomsStore.createRoom({ roomId, username, socketId: socket.id });
    socketUtilities.joinRoom({ socket, roomId, roomInStore: roomsStore.getRoom(roomId) });
  }
};
