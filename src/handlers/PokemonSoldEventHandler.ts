import socketio from 'socket.io';
import { gameRooms, getPlayerFromRoom } from './../managers/gameRoom.manager';
import _ from 'lodash';
import { registerHandler } from './BaseEventHandler';
import logger from './../logging/logger';
import PokemonSoldEventMessage from './../models/PokemonSoldEventMessage';
import { IPlayer } from './../models/gameroom';

export default (socket: socketio.Socket) => registerHandler<PokemonSoldEventMessage, IPlayer>(socket, 'pokemonSold', (data: PokemonSoldEventMessage, success, failure) => {
    logger.debug(`Starting [PokemonSoldEventHandler] request from player ${data.playerId}`);

    const player = getPlayerFromRoom(data.gameRoomId, data.playerId);

    const sellingPokemon = _.nth(player.board.activePokemon, data.activePokemonPosition);
    if (sellingPokemon === undefined)
        return failure('Pokemon at that position does not exist');
    
    // Any energy that is attached to the pokemon are given back to the player
    player.hand.cards = player.hand.cards.concat(sellingPokemon.attachedEnergy);
    sellingPokemon.attachedEnergy = [];

    // Add the pokemon back to the card pool
    const gameRoom = gameRooms.find(g => g.room.id === data.gameRoomId);
    gameRoom.room.cardPool.push(sellingPokemon.pokemon);

    // Remove from their board
    _.remove(player.board.activePokemon, sellingPokemon);

    return success(player);
});