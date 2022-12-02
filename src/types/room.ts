type User = any;

type RoomStore = {
  getRooms: () => void;
  getRoom: (roomId: string) => Room;
  setRoom: ({
    roomId,
    newRoomState,
  }: {
    roomId: string;
    newRoomState: Room;
  }) => void;
  createRoom: ({
    roomId,
    username,
    socketId,
  }: {
    roomId: string;
    username: string;
    socketId: string;
  }) => void;
  joinRoom: ({
    roomId,
    username,
    socketId,
  }: {
    roomId: string;
    username: string;
    socketId: string;
  }) => void;
  roomExists: () => boolean;
  leaveRoom: () => void;
  getRoomIdForSocketId: (socketId: string) => string;
  changeCard: () => void;
  getRoomCards: () => void;
  setRoomCards: () => void;
  startRoomVoting: () => void;
  stopRoomVoting: () => void;
  shouldShowCards: () => void;
  changeLeader: () => void;
};

type Room = any;

export { Room, RoomStore, User };
