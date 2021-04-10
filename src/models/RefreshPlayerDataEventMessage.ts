import { IPlayer } from './gameroom';

export default interface PokemonSoldEventMessage {
    gameRoomId: string;
    playerId: string;
    playerDetails: IPlayer;
}