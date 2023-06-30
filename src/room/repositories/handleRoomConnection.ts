import { Socket } from 'socket.io';

import { joinRoom } from '../socketUtilities/joinRoom';
import { isSocketInRoom } from '../helpers';
import { eventTypes } from '../constants/eventTypes';
import { RoomStore } from '../../types/room';
import { IoType } from '../../types/events';

export const handleRoomConnection =
  ({ io, roomsStore }: { io: IoType; roomsStore: RoomStore }) =>
  ({
    socket,
    payload,
  }: {
    socket: Socket;
    payload: { roomId: string; username: string };
  }) => {
    const { roomId, username } = payload;

    if (isSocketInRoom({ roomsStore, socket, roomId })) {
      socket.emit(eventTypes.STATE_CHANGE, roomsStore.getRoom(roomId));
      return;
    }

    if (roomsStore.roomExists(roomId)) {
      roomsStore.joinRoom({ roomId, username, socketId: socket.id });
      joinRoom({
        username,
        io,
        socket,
        roomId,
        roomInStore: roomsStore.getRoom(roomId),
      });
    } else {
      roomsStore.createRoom({ roomId, username, socketId: socket.id });
      joinRoom({
        username,
        io,
        socket,
        roomId,
        roomInStore: roomsStore.getRoom(roomId),
      });
    }
  };
