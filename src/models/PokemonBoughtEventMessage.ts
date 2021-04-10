export default interface PokemonBoughtEventMessage {
    gameRoomId: string;
    playerId: string;
    pokemonStorePosition: number;
}