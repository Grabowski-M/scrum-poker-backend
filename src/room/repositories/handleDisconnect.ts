import { eventTypes } from '../constants/eventTypes';

export const handleDisconnect = ({ io, roomsStore }) =>
  ({ socket }) => {
    const roomId = roomsStore.leaveRoom({ socketId: socket.id });

    if (roomId) {
      io.to(roomId).emit(eventTypes.STATE_CHANGE, roomsStore.getRoom(roomId));
    }
  };

