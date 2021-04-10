import { Phase } from "./../data/Enums";
import { IBattlePhasePlayerMatchup, IPlayer } from "./gameroom";

export default interface GameRoomDataEventMessage {
    gameRoomId: string;
    currentPhase: Phase;
    currentRound: number;
    playerMatchups: IBattlePhasePlayerMatchup[];
    player: IPlayer;
}
