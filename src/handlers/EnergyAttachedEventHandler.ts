import socketio from 'socket.io';
import { getPlayerFromRoom } from './../managers/gameRoom.manager';
import _ from 'lodash';
import { registerHandler } from './BaseEventHandler';
import logger from './../logging/logger';
import EnergyAttachedEventMessage from './../models/EnergyAttachedEventMessage';
import { IPlayer } from './../models/gameroom';
import { CardType } from './../data/Enums';

export default (socket: socketio.Socket) => registerHandler<EnergyAttachedEventMessage, IPlayer>(socket, 'energyAttached', (data: EnergyAttachedEventMessage, success, failure) => {
    logger.debug(`Starting [EnergyAttachedEventHandler] request from player ${data.playerId}`);

    const player = getPlayerFromRoom(data.gameRoomId, data.playerId);

    const targetPokemon = _.nth(player.board.activePokemon, data.activePokemonPosition);
    if (targetPokemon === undefined)
        return failure('Pokemon at that position does not exist');
    
    const energyCard = _.nth(player.hand.cards, data.handCardPosition);
    if (energyCard === undefined)
        return failure('Card at that position does not exist');

    if (energyCard.type !== CardType.Energy)
        return failure('Card is not an energy type');

    // Add the energy to the pokemon
    targetPokemon.attachedEnergy.push(energyCard);

    // Remove card from their hand
    _.remove(player.hand.cards, energyCard);

    return success(player);
});