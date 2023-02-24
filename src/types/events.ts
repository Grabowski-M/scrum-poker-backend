import { eventTypes } from '../room/constants/eventTypes';
import { Room } from './room';

export interface ServerToClientEvents {
  [eventTypes.STATE_CHANGE]: (roomState: Room) => any;
}

export interface ClientToServerEvents {
  [eventTypes.ROOM_CONNECT]: (payload: {
    roomId: string;
    username: string;
  }) => void;
  [eventTypes.TIMER_CHANGE]: (payload: { time: number }) => void;
  [eventTypes.CARD_CHANGE]: (payload: { card: string }) => void;
  [eventTypes.PROMOTE_TO_LEADER]: (payload: { participantId: string }) => void;
  [eventTypes.START_VOTING]: () => void;
  [eventTypes.STOP_VOTING]: () => void;
  [eventTypes.DISCONNECT]: () => void;
  [eventTypes.STATE_CHANGE]: () => void;
}

export type SocketData = any
