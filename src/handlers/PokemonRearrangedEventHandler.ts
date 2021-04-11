import socketio from 'socket.io';
import { getPlayerFromRoom } from './../managers/gameRoom.manager';
import _ from 'lodash';
import { registerHandler } from './BaseEventHandler';
import logger from './../logging/logger';
import PokemonRearrangedEventMessage from './../models/PokemonRearrangedEventMessage';
import { IPlayer } from './../models/gameroom';

export default (socket: socketio.Socket) => registerHandler<PokemonRearrangedEventMessage, IPlayer>(socket, 'pokemonRearranged', (data: PokemonRearrangedEventMessage, success, failure) => {
    logger.debug(`Starting [PokemonRearrangedEventHandler] request from player ${data.playerId}`);

    const player = getPlayerFromRoom(data.gameRoomId, data.playerId);

    const currentPositionPokemon = _.nth(player.board.activePokemon, data.activePokemonPosition);
    if (currentPositionPokemon === undefined)
        return failure('Pokemon at that position does not exist');
    
    // Swap the two pokemon positions
    [player.board.activePokemon[data.activePokemonPosition], player.board.activePokemon[data.newActivePokemonPosition]] =
        [player.board.activePokemon[data.newActivePokemonPosition], player.board.activePokemon[data.activePokemonPosition]]

    return success(player);
});