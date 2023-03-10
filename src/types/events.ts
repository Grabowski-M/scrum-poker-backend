import { Socket } from 'socket.io';
import { eventTypes } from '../room/constants/eventTypes';
import { Room, RoomCards } from './room';

export interface ServerToClientEvents {
  [eventTypes.STATE_CHANGE]: (roomState: Room) => any;
  [eventTypes.RESET_CARDS]: () => void;
  [eventTypes.SHOW_CARDS]: (roomCards: RoomCards) => void;
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
  [eventTypes.RESET_CARDS]: () => void;
}

export type IoType = Socket< 
        ClientToServerEvents,
        ServerToClientEvents,
        SocketData
    >

export type SocketData = any
