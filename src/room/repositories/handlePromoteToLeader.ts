// eslint-disable-next-line
// @ts-nocheck
import { eventTypes } from '../constants/eventTypes';
import { Socket } from 'socket.io';

export const handlePromoteToLeader =
  ({ io, roomsStore }: { io: io }) =>
  ({ socket, payload }: { socket: Socket, payload: { participantId: string } }) => {
    const roomId = roomsStore.getRoomIdForSocketId(socket.id);
    const { participantId } = payload;

    roomsStore.changeLeader({ roomId, participantId });
    io.to(roomId).emit(eventTypes.STATE_CHANGE, roomsStore.getRoom(roomId));
  };
