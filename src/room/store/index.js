const { getRoomInitialState, getParticipantInitialState } = require('../helpers');

const createRoomsStore = () => {
  const rooms = {};
  const userRoomMap = {};
  const roomCards = {};
  const users = {};

  const getRooms = () => rooms;

  const getRoom = (roomId) => rooms[roomId];

  const setRoom = ({ roomId, newRoomState }) => {
    rooms[roomId] = newRoomState;
  };

  const getRoomIdForSocketId = (socketId) => userRoomMap[socketId];

  const roomExists = (roomId) => !!rooms[roomId];

  const createRoom = ({ roomId, username, socketId }) => {
    const user = getParticipantInitialState({ username, socketId, leader: socketId });
    users[socketId] = username;

    rooms[roomId] = getRoomInitialState({ roomId, user });
    userRoomMap[socketId] = roomId;
  };

  const joinRoom = ({ roomId, username, socketId }) => {
    rooms[roomId].participants
      .push(getParticipantInitialState({ username, socketId }));
    userRoomMap[socketId] = roomId;
    users[socketId] = username;
  };

  const leaveRoom = ({ socketId }) => {
    const roomId = userRoomMap[socketId];

    if (!roomId) {
      return '';
    }

    rooms[roomId].participants = rooms[roomId].participants
      .filter((participant) => participant.socketId !== socketId);

    if (rooms[roomId].leader === socketId && rooms[roomId].participants.length > 0) {
      rooms[roomId].leader = rooms[roomId].participants[0].socketId;
    }

    if (rooms[roomId].participants.length === 0) {
      delete rooms[roomId];
      delete roomCards[roomId];
      delete userRoomMap[socketId];
      delete users[socketId];
    }

    return roomId;
  };

  const changeCard = ({ socketId, card }) => {
    const roomId = userRoomMap[socketId];

    roomCards[roomId] = {
      ...roomCards[roomId],
      [socketId]: card,
    };
  };

  const shouldShowCards = ({ roomId }) => Object.keys(roomCards[roomId]).length
    === rooms[roomId].participants.length;

  const getRoomCards = (roomId) => roomCards[roomId];

  const stopRoomVoting = (roomId) => {
    rooms[roomId].voting = false;
  };

  const startRoomVoting = (roomId) => {
    roomCards[roomId] = {};
    rooms[roomId].voting = true;
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
    startRoomVoting,
    stopRoomVoting,
    shouldShowCards,
  };
};

module.exports = {
  createRoomsStore,
};
