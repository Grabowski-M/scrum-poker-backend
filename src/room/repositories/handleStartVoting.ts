// eslint-disable-next-line
// @ts-nocheck
import { eventTypes } from '../constants/eventTypes';

export const handleStartVoting = ({ io, roomsStore }) =>
  ({ socket }) => {
    const roomId = roomsStore.getRoomIdForSocketId(socket.id);
    roomsStore.startRoomVoting(roomId);

    io.to(roomId).emit(eventTypes.STATE_CHANGE, roomsStore.getRoom(roomId));
    io.to(roomId).emit(eventTypes.RESET_CARDS);
    io.emit(eventTypes.STATE_CHANGE, roomsStore.getRoom(roomId));
  };
