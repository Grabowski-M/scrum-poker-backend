// eslint-disable-next-line
// @ts-nocheck
import { joinRoom } from '../socketUtilities/joinRoom';
import { isSocketInRoom } from '../helpers';
import { eventTypes } from '../constants/eventTypes';

export const handleRoomConnection =
  ({ io, roomsStore }) =>
  ({ socket, payload }) => {
    const { roomId, username } = payload;

    if (isSocketInRoom({ roomsStore, socket, roomId })) {
      socket.emit(eventTypes.STATE_CHANGE, roomsStore.getRoom(roomId));
      return;
    }

    if (roomsStore.roomExists(roomId)) {
      roomsStore.joinRoom({ roomId, username, socketId: socket.id });
      joinRoom({
        io,
        socket,
        roomId,
        roomInStore: roomsStore.getRoom(roomId),
      });
    } else {
      roomsStore.createRoom({ roomId, username, socketId: socket.id });
      joinRoom({
        io,
        socket,
        roomId,
        roomInStore: roomsStore.getRoom(roomId),
      });
    }
  };
