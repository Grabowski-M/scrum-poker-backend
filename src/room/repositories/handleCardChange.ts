import { handleStopVoting } from './handleStopVoting';

export const handleCardChange = ({ io, roomsStore }) =>
  ({ socket, payload }) => {
    const roomId = roomsStore.getRoomIdForSocketId(socket.id);
    const { card } = payload;
    roomsStore.changeCard({ socketId: socket.id, card });

    if (roomsStore.shouldShowCards({ roomId })) {
      handleStopVoting({ io, roomsStore })({ socket });
    }
  };
