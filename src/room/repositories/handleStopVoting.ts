import { Socket } from 'socket.io';
import { IoType } from '../../types/events';
import { RoomCards, RoomStore } from '../../types/room';
import { eventTypes } from '../constants/eventTypes';

const MAX_VOTE_VALUE = 999;

const getAverage = (cards = {} as {[Key: string]: number}): number => {
  const keys = Object.keys(cards);
  const sum = keys.reduce((acc, currKey) => acc + Number(cards[currKey]), 0);

  return keys.length > 0 ? sum / keys.length : 0;
};

const findClosestToAverage = (cards = {} as {[Key: string]: number}, average: number): number =>
  Object.keys(cards).reduce(
    (acc, currKey) =>
      Math.abs(cards[currKey] - average) < Math.abs(acc - average)
        ? cards[currKey]
        : acc,
    MAX_VOTE_VALUE
  );

const getCardsWithDeviation = (cards = {} as {[Key: string]: number}) => {
  const average = getAverage(cards);
  const closestToAverage = findClosestToAverage(cards, average);

  return Object.keys(cards).reduce((cardsWithDeviation, currKey) => {
    const value = Number(cards[currKey]);

    return {
      ...cardsWithDeviation,
      [currKey]: {
        value,
        high: value > closestToAverage,
        low: value < closestToAverage,
      },
    };
  }, {});
};

export const handleStopVoting = ({ io, roomsStore }: { io: IoType, roomsStore: RoomStore }) =>
  ({ socket }: { socket: Socket }) => {
    const roomId = roomsStore.getRoomIdForSocketId(socket.id);

    roomsStore.setRoomsCards({
      roomId,
      newCards: getCardsWithDeviation(roomsStore.getRoomCards(roomId)),
    });

    roomsStore.stopRoomVoting(roomId);
    io.to(roomId).emit(eventTypes.SHOW_CARDS, roomsStore.getRoomCards(roomId));
    io.to(roomId).emit(eventTypes.STATE_CHANGE, roomsStore.getRoom(roomId));
  };
