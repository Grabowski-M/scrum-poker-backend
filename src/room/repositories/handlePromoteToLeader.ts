import { eventTypes } from '../constants/eventTypes';
import { Socket } from 'socket.io';
import { RoomStore } from '../../types/room';
import { IoType } from '../../types/events';

export const handlePromoteToLeader =
  ({ io, roomsStore }: { io: IoType; roomsStore: RoomStore }) =>
  ({
    socket,
    payload,
  }: {
    socket: Socket;
    payload: { participantId: string };
  }) => {
    const roomId = roomsStore.getRoomIdForSocketId(socket.id);
    const { participantId } = payload;

    roomsStore.changeLeader({ roomId, participantId });
    io.to(roomId).emit(eventTypes.STATE_CHANGE, roomsStore.getRoom(roomId));
  };
