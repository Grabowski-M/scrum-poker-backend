type RoomStore = {
  stopRoomVoting: (roomId: string) => void;
  roomExists: (roomId: string) => boolean;
  changeCard: ({ socketId, card }: { socketId: string; card: number }) => void;
  startRoomVoting: (roomId: string) => void;
  setRoomsCards: ({
    roomId,
    newCards,
  }: {
    roomId: string;
    newCards: RoomCards;
  }) => void;
  getRoomCards: (roomId: string) => { [p: string]: number };
  changeLeader: ({
    roomId,
    participantId,
  }: {
    roomId: string;
    participantId: string;
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
  shouldShowCards: ({ roomId }: { roomId: string }) => boolean;
  setRoom: ({
    roomId,
    newRoomState,
  }: {
    roomId: string;
    newRoomState: Room;
  }) => void;
  getRoom: (roomId: string) => Room;
  getRoomIdForSocketId: (socketId: string) => string;
  leaveRoom: ({ socketId }: { socketId: string }) => string;
  joinRoom: ({
    roomId,
    username,
    socketId,
  }: {
    roomId: string;
    username: string;
    socketId: string;
  }) => void;
  removeParticipant: ({ participantId }: { participantId: string }) => string;
};

interface Participant {
  socketId: string;
  username: string;
}

interface Room {
  roomId: string;
  showCards: boolean;
  voting: boolean;
  participants: Participant[];
  leader: string;
  targetTime: null | Date;
  availableCards: number[];
}

type RoomCards = { [Key: string]: number };

export { Room, RoomStore, Participant, RoomCards };
