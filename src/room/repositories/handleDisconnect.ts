import { Server, Socket } from 'socket.io';
import { IoType } from '../../types/events';
import { RoomStore } from '../../types/room';

import { eventTypes } from '../constants/eventTypes';

export const handleDisconnect = ({ io, roomsStore }: { io: IoType, roomsStore: RoomStore }) =>
  ({ socket }: { socket: Socket }) => {
    const roomId = roomsStore.leaveRoom({ socketId: socket.id });

    if (roomId) {
      io.to(roomId).emit(eventTypes.STATE_CHANGE, roomsStore.getRoom(roomId));
    }
  };

