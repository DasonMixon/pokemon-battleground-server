export default interface PokemonPlayedEventMessage {
    gameRoomId: string;
    playerId: string;
    handCardPosition: number;
    activePokemonPosition: number;
}