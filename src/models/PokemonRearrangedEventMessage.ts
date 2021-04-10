export default interface PokemonRearrangedEventMessage {
    gameRoomId: string;
    playerId: string;
    activePokemonPosition: number;
    newActivePokemonPosition: number;
}