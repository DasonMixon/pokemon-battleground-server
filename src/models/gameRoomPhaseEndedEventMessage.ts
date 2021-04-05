import { Phase } from "./gameroom";

export default interface GameRoomPhaseEndedEventMessage {
    gameRoomId: string;
    oldPhase: Phase;
    newPhase: Phase;
}