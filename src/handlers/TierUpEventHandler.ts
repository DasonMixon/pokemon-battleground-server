import socketio from 'socket.io';
import { getPlayerFromRoom, startingTierUpCosts } from './../managers/gameRoom.manager';
import _ from 'lodash';
import { registerHandler } from './BaseEventHandler';
import logger from './../logging/logger';
import TierUpEventMessage from './../models/TierUpEventMessage';
import { CardType } from './../data/Enums';
import { IPlayer } from './../models/gameroom';

export default (socket: socketio.Socket) => registerHandler<TierUpEventMessage, IPlayer>(socket, 'tierUp', (data: TierUpEventMessage, success, failure) => {
    logger.debug(`Starting [TierUpEventHandler] request from player ${data.playerId}`);

    const player = getPlayerFromRoom(data.gameRoomId, data.playerId);

    // Make sure we got enough energy card positions
    if (data.handEnergyCardPositions.length < player.tierUpCost)
        return failure('Must provide three energy cards to tier up');

    // Make sure the positions provided correspond to actual energy cards
    data.handEnergyCardPositions.forEach(e => {
        const energyCard = _.nth(player.hand.cards, e);
        if (energyCard === undefined)
            return failure(`Card at position ${e} was not found in player's hand`);
        
        if (energyCard.type !== CardType.Energy)
            return failure(`Card at position ${e} was not an energy card`);
    });

    _.pullAt(player.hand.cards, data.handEnergyCardPositions);
    player.currentTier += 1;
    if (player.currentTier < 6)
        player.tierUpCost = startingTierUpCosts.get(player.currentTier)
    else
        player.tierUpCost = 0;

    return success(player);
});