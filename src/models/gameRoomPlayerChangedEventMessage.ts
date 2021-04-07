export default interface GameRoomPlayerChangedEventMessage {
    playerId: string;
    wasKnockedOut: boolean;
    currentHealth: number;
}