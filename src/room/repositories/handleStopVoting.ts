// eslint-disable-next-line
// @ts-nocheck
import { eventTypes } from '../constants/eventTypes';

const MAX_VOTE_VALUE = 999;

const getAverage = (cards = {}) => {
  const keys = Object.keys(cards);
  const sum = keys.reduce((acc, currKey) => acc + Number(cards[currKey]), 0);

  return keys.length > 0 ? sum / keys.length : 0;
};

const findClosestToAverage = (cards = {}, average) =>
  Object.keys(cards).reduce(
    (acc, currKey) =>
      Math.abs(cards[currKey] - average) < Math.abs(acc - average)
        ? cards[currKey]
        : acc,
    MAX_VOTE_VALUE
  );

const getCardsWithDeviation = (cards = {}) => {
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

export const handleStopVoting = ({ io, roomsStore }) =>
  ({ socket }) => {
    const roomId = roomsStore.getRoomIdForSocketId(socket.id);

    roomsStore.setRoomsCards({
      roomId,
      newCards: getCardsWithDeviation(roomsStore.getRoomCards(roomId)),
    });

    roomsStore.stopRoomVoting(roomId);
    io.to(roomId).emit(eventTypes.SHOW_CARDS, roomsStore.getRoomCards(roomId));
    io.to(roomId).emit(eventTypes.STATE_CHANGE, roomsStore.getRoom(roomId));
  };
