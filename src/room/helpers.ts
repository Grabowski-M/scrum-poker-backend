import { RoomStore, User } from '../types/room';
import { Socket } from 'socket.io';

const getParticipantInitialState = ({
  username,
  socketId,
}: {
  username: string;
  socketId: string;
}) => ({
  socketId,
  username,
});

const getRoomInitialState = ({
  roomId,
  user,
}: {
  roomId: string;
  user: User;
}) => ({
  roomId,
  showCards: false,
  voting: false,
  participants: [user],
  leader: user.socketId,
  targetTime: null,
  availableCards: [0, 0.5, 1, 2, 3, 5, 8, 13],
});

const isSocketInRoom = ({
  roomsStore,
  socket,
  roomId,
}: {
  roomsStore: RoomStore;
  socket: Socket;
  roomId: string;
}) => roomsStore.getRoomIdForSocketId(socket.id) === roomId;

export { getRoomInitialState, getParticipantInitialState, isSocketInRoom };
