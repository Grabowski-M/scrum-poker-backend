// eslint-disable-next-line
// @ts-nocheck
import { eventTypes } from '../constants/eventTypes';

export const joinRoom = ({ username, io, socket, roomId, roomInStore }) => {
  console.log(
    '\x1b[36m%s\x1b[0m',
    `${socket.id} - Name: ${username} joined room number ${roomId}`
  ); // eslint-disable-line

  socket.join(roomId);
  io.to(roomId).emit(eventTypes.STATE_CHANGE, roomInStore);
};
