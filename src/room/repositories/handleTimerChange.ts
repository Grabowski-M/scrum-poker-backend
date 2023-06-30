// eslint-disable-next-line
// @ts-nocheck
import { eventTypes } from '../constants/eventTypes';

export const handleTimerChange =
  ({ io, roomsStore }) =>
  ({ socket, payload }) => {
    const { time } = payload;
    const roomId = roomsStore.getRoomIdForSocketId(socket.id);
    const roomInStore = roomsStore.getRoom(roomId);

    if (time) {
      const now = new Date();

      roomsStore.setRoom({
        roomId,
        newRoomState: {
          ...roomInStore,
          targetTime: new Date(now.getTime() + time * 60 * 1000),
        },
      });
    } else {
      roomsStore.setRoom({
        roomId,
        newRoomState: {
          ...roomInStore,
          targetTime: null,
        },
      });
    }

    io.to(roomId).emit(eventTypes.STATE_CHANGE, roomsStore.getRoom(roomId));
  };
