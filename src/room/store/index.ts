import { getRoomInitialState, getParticipantInitialState } from '../helpers';
import { Participant, Room, RoomCards, RoomStore } from '../../types/room';

const createRoomsStore: () => RoomStore = () => {
  const rooms: { [Key: string]: Room } = {};
  const userRoomMap: { [Key: string]: string } = {};
  const roomsCards: { [Key: string]: { [Key: string]: number } } = {};
  const users: { [Key: string]: string } = {};

  const getRoom = (roomId: string) => rooms[roomId];

  const setRoom = ({
    roomId,
    newRoomState,
  }: {
    roomId: string;
    newRoomState: Room;
  }) => {
    rooms[roomId] = newRoomState;
  };

  const getRoomIdForSocketId = (socketId: string) => userRoomMap[socketId];

  const roomExists = (roomId: string) => !!rooms[roomId];

  const createRoom = ({
    roomId,
    username,
    socketId,
  }: {
    roomId: string;
    username: string;
    socketId: string;
  }) => {
    const participant = getParticipantInitialState({ username, socketId });
    users[socketId] = username;

    rooms[roomId] = getRoomInitialState({ roomId, participant });
    userRoomMap[socketId] = roomId;
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
    rooms[roomId].participants.push(
      getParticipantInitialState({ username, socketId })
    );
    userRoomMap[socketId] = roomId;
    users[socketId] = username;
  };

  const removeParticipant = ({ participantId }: { participantId: string }) => {
    const roomId = userRoomMap[participantId];

    if (!roomId) {
      return '';
    }

    rooms[roomId].participants = rooms[roomId].participants.filter(
      (participant: Participant) => participant.socketId !== participantId
    );

    delete userRoomMap[participantId];
    delete users[participantId];
    delete roomsCards[roomId][participantId];

    console.log(roomsCards[roomId]);

    return roomId;
  };

  const leaveRoom = ({ socketId }: { socketId: string }) => {
    const roomId = userRoomMap[socketId];

    if (!roomId) {
      return '';
    }

    rooms[roomId].participants = rooms[roomId].participants.filter(
      (participant: Participant) => participant.socketId !== socketId
    );

    if (
      rooms[roomId].leader === socketId &&
      rooms[roomId].participants.length > 0
    ) {
      rooms[roomId].leader = rooms[roomId].participants[0].socketId;
    }

    if (rooms[roomId].participants.length === 0) {
      delete rooms[roomId];
      delete roomsCards[roomId];
      delete userRoomMap[socketId];
      delete users[socketId];
    }

    return roomId;
  };

  const changeCard = ({
    socketId,
    card,
  }: {
    socketId: string;
    card: number;
  }) => {
    const roomId = userRoomMap[socketId];

    if (roomsCards[roomId][socketId] === card) {
      delete roomsCards[roomId][socketId];
    } else {
      roomsCards[roomId] = {
        ...roomsCards[roomId],
        [socketId]: card,
      };
    }
    console.log(roomsCards[roomId]);
    rooms[roomId].progress = Object.keys(roomsCards[roomId]).length;
  };

  const shouldShowCards = ({ roomId }: { roomId: string }) =>
    Object.keys(roomsCards[roomId]).length ===
    rooms[roomId].participants.length;

  const getRoomCards = (roomId: string) => roomsCards[roomId];

  const setRoomsCards = ({
    roomId,
    newCards,
  }: {
    roomId: string;
    newCards: RoomCards;
  }) => {
    roomsCards[roomId] = newCards;
  };

  const stopRoomVoting = (roomId: string) => {
    rooms[roomId].voting = false;
    rooms[roomId].progress = rooms[roomId].participants.length;
  };

  const startRoomVoting = (roomId: string) => {
    roomsCards[roomId] = {};
    rooms[roomId].voting = true;
    rooms[roomId].progress = 0;
  };

  const changeLeader = ({
    roomId,
    participantId,
  }: {
    roomId: string;
    participantId: string;
  }) => {
    rooms[roomId].leader = participantId;
  };

  return {
    getRoom,
    setRoom,
    createRoom,
    joinRoom,
    roomExists,
    leaveRoom,
    getRoomIdForSocketId,
    changeCard,
    getRoomCards,
    setRoomsCards,
    startRoomVoting,
    stopRoomVoting,
    shouldShowCards,
    changeLeader,
    removeParticipant,
  };
};

export { createRoomsStore };
