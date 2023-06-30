import { Socket } from 'socket.io';
import { IoType } from '../../types/events';
import { RoomStore } from '../../types/room';
import { handleStopVoting } from './handleStopVoting';

export const handleCardChange =
  ({ io, roomsStore }: { io: IoType; roomsStore: RoomStore }) =>
  ({ socket, payload }: { socket: Socket; payload: { card: number } }) => {
    const roomId = roomsStore.getRoomIdForSocketId(socket.id);
    const { card } = payload;
    roomsStore.changeCard({ socketId: socket.id, card });

    if (roomsStore.shouldShowCards({ roomId })) {
      handleStopVoting({ io, roomsStore })({ socket });
    }
  };
