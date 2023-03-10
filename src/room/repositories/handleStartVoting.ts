import { Socket } from 'socket.io';
import { IoType } from '../../types/events';
import { RoomStore } from '../../types/room';
import { eventTypes } from '../constants/eventTypes';

export const handleStartVoting = ({ io, roomsStore }: { io: IoType, roomsStore: RoomStore }) =>
  ({ socket }: { socket: Socket }) => {
    const roomId = roomsStore.getRoomIdForSocketId(socket.id);
    roomsStore.startRoomVoting(roomId);

    io.to(roomId).emit(eventTypes.STATE_CHANGE, roomsStore.getRoom(roomId));
    io.to(roomId).emit(eventTypes.RESET_CARDS);
    io.to(roomId).emit(eventTypes.STATE_CHANGE, roomsStore.getRoom(roomId));
  };
