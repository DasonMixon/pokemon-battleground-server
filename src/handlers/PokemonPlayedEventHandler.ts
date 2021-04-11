import socketio from 'socket.io';
import { getPlayerFromRoom } from './../managers/gameRoom.manager';
import _ from 'lodash';
import { registerHandler } from './BaseEventHandler';
import logger from './../logging/logger';
import PokemonPlayedEventMessage from './../models/PokemonPlayedEventMessage';
import { IPlayer } from './../models/gameroom';
import { CardType } from './../data/Enums';

export default (socket: socketio.Socket) => registerHandler<PokemonPlayedEventMessage, IPlayer>(socket, 'pokemonPlayed', (data: PokemonPlayedEventMessage, success, failure) => {
    logger.debug(`Starting [PokemonPlayedEventHandler] request from player ${data.playerId}`);

    const player = getPlayerFromRoom(data.gameRoomId, data.playerId);

    // Make sure the card index they gave exists in their hand and it's actually a pokemon
    const pokemonToPlay = _.nth(player.hand.cards, data.handCardPosition);
    if (pokemonToPlay === undefined)
        return failure('Card at that position does not exist');
    
    if (pokemonToPlay.type !== CardType.Pokemon)
        return failure('Card is not a pokemon type');

    // Make sure their board is not already full
    if (player.board.activePokemon.length >= 6)
        return failure('Player board is already full');

    // Put the pokemon on the board
    player.board.activePokemon.splice(data.handCardPosition, 0, {
        pokemon: pokemonToPlay,
        currentHealth: pokemonToPlay.maxHealth,
        hasAttacked: false,
        position: data.handCardPosition,
        attachedEnergy: []
    });

    // Remove the card from their hand
    _.remove(player.hand.cards, pokemonToPlay);

    return success(player);
});