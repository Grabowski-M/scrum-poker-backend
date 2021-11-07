const { getRoomInitialState, getParticipantInitialState } = require('../helpers');
const roles = require('../constants/roles');

const createRoomsStore = () => {
  const rooms = {};
  const userRoomMap = {};

  const getRooms = () => rooms;

  const getRoom = (roomId) => rooms[roomId];

  const roomExists = (roomId) => !!rooms[roomId];

  const createRoom = ({ roomId, username, socketId }) => {
    const user = getParticipantInitialState({ username, socketId, role: roles.LEADER });

    rooms[roomId] = getRoomInitialState({ roomId, user });
    userRoomMap[socketId] = roomId;
  };

  const joinRoom = ({ roomId, username, socketId }) => {
    rooms[roomId].participants
      .push(getParticipantInitialState({ username, socketId, role: roles.PARTICIPANT }));
    userRoomMap[socketId] = roomId;
  };

  const leaveRoom = ({ socketId }) => {
    const roomId = userRoomMap[socketId];

    if (!roomId) {
      return '';
    }

    rooms[roomId].participants = rooms[roomId].participants
      .filter((participant) => participant.socketId !== socketId);

    if (rooms[roomId].participants.length === 0) {
      rooms[roomId] = null;
    }

    return roomId;
  };

  return {
    getRooms,
    getRoom,
    createRoom,
    joinRoom,
    roomExists,
    leaveRoom,
  };
};

module.exports = {
  createRoomsStore,
};
