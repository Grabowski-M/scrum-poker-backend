const socketUtilities = require('../socketUtilities');
const { isSocketInRoom } = require('../helpers');
const { STATE_CHANGE } = require('../constants/eventTypes');

module.exports = ({ roomsStore }) => ({ socket, payload }) => {
  const { roomId, username } = payload;

  if (isSocketInRoom({ roomsStore, socket, roomId })) {
    socket.emit(STATE_CHANGE, roomsStore.getRoom(roomId));
    return;
  }

  if (roomsStore.roomExists(roomId)) {
    roomsStore.joinRoom({ roomId, username, socketId: socket.id });
    socketUtilities.joinRoom({ socket, roomId, roomInStore: roomsStore.getRoom(roomId) });
  } else {
    roomsStore.createRoom({ roomId, username, socketId: socket.id });
    socketUtilities.joinRoom({ socket, roomId, roomInStore: roomsStore.getRoom(roomId) });
  }
};
