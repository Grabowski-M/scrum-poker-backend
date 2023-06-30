import { Participant, RoomStore } from '../types/room';
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
  participant,
}: {
  roomId: string;
  participant: Participant;
}) => ({
  roomId,
  showCards: false,
  voting: false,
  participants: [participant],
  leader: participant.socketId,
  targetTime: null,
  availableCards: [0, 0.5, 1, 2, 3, 5, 8, 13],
  progress: 0,
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
