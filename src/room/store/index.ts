import { getRoomInitialState, getParticipantInitialState } from '../helpers';
import { Room, RoomStore, User } from '../../types/room';

const createRoomsStore: () => RoomStore = () => {
  const rooms: Map<string, Room> = new Map();
  const userRoomMap: Map<string, Room> = new Map();
  const roomCards = {};
  const users: Map<string, User> = new Map();

  const getRooms = () => rooms;

  const getRoom = (roomId: string) => rooms.get(roomId);

  const setRoom = ({
    roomId,
    newRoomState,
  }: {
    roomId: string;
    newRoomState: Room;
  }) => {
    rooms.set(roomId, newRoomState);
  };

  const getRoomIdForSocketId = (socketId: string) => userRoomMap.get(socketId);

  const roomExists = (roomId: string) => rooms.has(roomId);

  const createRoom = ({
    roomId,
    username,
    socketId,
  }: {
    roomId: string;
    username: string;
    socketId: string;
  }) => {
    const user = getParticipantInitialState({
      username,
      socketId,
    });
    users.set(socketId, username);

    rooms.set(roomId, getRoomInitialState({ roomId, user }));
    userRoomMap.set(socketId, roomId);
  };

  const joinRoom = ({
    roomId,
    username,
    socketId,
  }: {
    roomId: string;
    username: string;
    socketId: string;
  }) => {
    const roomToJoin = rooms.get(roomId);
    rooms.set(roomId, {
      ...roomToJoin,
      participants: [
        ...roomToJoin.participants,
        getParticipantInitialState({ username, socketId }),
      ],
    });
    userRoomMap.set(socketId, roomId);
    users.set(socketId, username);
  };

  const leaveRoom = ({ socketId }: { socketId: string }) => {
    const roomId = userRoomMap.get(socketId);

    if (!roomId) {
      return '';
    }

    const roomToLeave = rooms.get(roomId);
    rooms.set(roomId, {
      ...roomToLeave,
      participants: roomToLeave.participants.filter(
        (participant: User) => participant.socketId !== socketId
      ),
    });

    if (
      roomToLeave.leader === socketId &&
      rooms.get(roomId).participants.length > 0
    ) {
      rooms.set(roomId, {
        ...rooms.get(roomId),
        leader: rooms.get(roomId).participants[0].socketId,
      })
    }

    if (rooms.get(roomId).participants.length === 0) {
      rooms.delete(roomId);
      roomCards.delete(roomId);
      userRoomMap.delete(socketId);
      users.delete(socketId);
    }

    return roomId;
  };

  const changeCard = ({ socketId, card }) => {
    const roomId = userRoomMap.get(socketId);

    roomCards[roomId] = {
      ...roomCards[roomId],
      [socketId]: card,
    };
  };

  const shouldShowCards = ({ roomId }) =>
    Object.keys(roomCards[roomId]).length === rooms[roomId].participants.length;

  const getRoomCards = (roomId) => roomCards[roomId];

  const setRoomCards = ({ roomId, newCards }) => {
    roomCards[roomId] = newCards;
  };

  const stopRoomVoting = (roomId) => {
    rooms[roomId].voting = false;
  };

  const startRoomVoting = (roomId) => {
    roomCards[roomId] = {};
    rooms[roomId].voting = true;
  };

  const changeLeader = ({ roomId, participantId }) => {
    rooms[roomId].leader = participantId;
  };

  return {
    getRooms,
    getRoom,
    setRoom,
    createRoom,
    joinRoom,
    roomExists,
    leaveRoom,
    getRoomIdForSocketId,
    changeCard,
    getRoomCards,
    setRoomCards,
    startRoomVoting,
    stopRoomVoting,
    shouldShowCards,
    changeLeader,
  };
};

export { createRoomsStore };
