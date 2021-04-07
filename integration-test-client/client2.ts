import socketio from 'socket.io-client';
import dotenv from 'dotenv';
import JoinGameRoomEventMessage from './../src/models/joinGameRoomEventMessage';
import GameRoomPhaseTimeLeftUpdatedEventMessage from './../src/models/gameRoomPhaseTimeLeftUpdatedEventMessage';
import GameRoomPhaseEndedEventMessage from '../src/models/gameRoomPhaseEndedEventMessage';
import GameRoomPlayerChangedEventMessage from '../src/models/gameRoomPlayerChangedEventMessage';
import GameRoomBattlePhaseOutcomeEventMessage from '../src/models/gameRoomBattlePhaseOutcomeEventMessage';
import GameRoomEndedEventMessage from '../src/models/gameRoomEnded';

dotenv.config();

const client = socketio(process.env.INTEGRATION_TEST_SERVER_SOCKET_ADDRESS);

client.on('connect', () => {
    console.log('connected to server');
    
    const message: JoinGameRoomEventMessage = {
        gameRoomId: "GameRoom1",
        playerId: "Player1",
        playerUsername: "Player1"
    }
    client.emit("joinGameRoom", message, (response: any) => {
        console.log(response);
    });
});

client.on("GameRoomPhaseTimeLeftUpdated", (data: GameRoomPhaseTimeLeftUpdatedEventMessage) => {
    console.log(`[GameRoomPhaseTimeLeftUpdated] Time left: ${data.phaseTimeLeft}`);
});

client.on("GameRoomPhaseEnded", (data: GameRoomPhaseEndedEventMessage) => {
    console.log(`[GameRoomPhaseEnded] Old phase: ${data.oldPhase} | New phase: ${data.newPhase}`);
});

client.on("GameRoomPlayerChanged", (data: GameRoomPlayerChangedEventMessage) => {
    const knocked = data.wasKnockedOut ? 'was' : 'was not';
    console.log(`[GameRoomPlayerChanged] Player '${data.playerId}' ${knocked} knocked out. Their remaining health: ${data.currentHealth}`);
});

client.on("GameRoomBattlePhaseOutcome", (data: GameRoomBattlePhaseOutcomeEventMessage) => {
    console.log(`[GameRoomBattlePhaseOutcome] Player '${data.result.firstAttackingPlayer}' attacked first, player '${data.result.winningPlayer}' won the round!`);
});

client.on("GameRoomEnded", (data: GameRoomEndedEventMessage) => {
    console.log(`[GameRoomEnded] Player '${data.winningPlayerId}' won the game!`);
});

client.on("disconnect", () => {
    console.log('disconnected from server');
});

client.on('gameStarted', () => {
    console.log('Received gameStarted event');
});