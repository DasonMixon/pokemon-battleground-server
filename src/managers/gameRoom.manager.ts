import { GameRoom, IPlayer } from "./../models/gameroom";

const gameRooms = new Array<GameRoom>();
const socketGameRoomAssociations = new Array<{ gameRoomId: string, socketId: string }>();

const getPlayerFromRoom = (gameRoomId: string, playerId: string): IPlayer => {
    const gameRoom = gameRooms.find(gr => gr.room.id === gameRoomId);
    if (gameRoom === undefined) {
        throw new Error(`GameRoom with id '${gameRoom}' does not exist.`);
    }

    const player = gameRoom.room.players.find(p => p.id === playerId);
    if (player === undefined) {
        throw new Error(`Player with id '${playerId}' does not exist in room '${gameRoom}'.`);
    }

    return player;
}

const startingTierUpCosts: Map<number, number> = new Map([
    [1, 5],
    [2, 7],
    [3, 8],
    [4, 9],
    [5, 11]
]);

export { gameRooms, socketGameRoomAssociations, getPlayerFromRoom, startingTierUpCosts }