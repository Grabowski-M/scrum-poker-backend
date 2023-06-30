import { Socket } from 'socket.io';
import { IoType } from '../../types/events';
import { RoomCards, RoomStore } from '../../types/room';
import { eventTypes } from '../constants/eventTypes';

export const handleVotingProgressChange =
  ({ io, roomsStore }: { io: IoType; roomsStore: RoomStore }) =>
  ({ socket }: { socket: Socket }) => {
    const roomId = roomsStore.getRoomIdForSocketId(socket.id);

    roomsStore.stopRoomVoting(roomId);
    io.to(roomId).emit(eventTypes.SHOW_CARDS, roomsStore.getRoomCards(roomId));
    io.to(roomId).emit(eventTypes.STATE_CHANGE, roomsStore.getRoom(roomId));
  };
