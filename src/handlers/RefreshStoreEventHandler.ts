import socketio from 'socket.io';
import { gameRooms, getPlayerFromRoom } from './../managers/gameRoom.manager';
import _ from 'lodash';
import { registerHandler } from './BaseEventHandler';
import logger from './../logging/logger';
import RefreshStoreEventMessage from './../models/RefreshStoreEventMessage';
import { IPlayer } from './../models/gameroom';
import { CardType } from './../data/Enums';

export default (socket: socketio.Socket) => registerHandler<RefreshStoreEventMessage, IPlayer>(socket, 'refreshStore', (data: RefreshStoreEventMessage, success, failure) => {
    logger.debug(`Starting [FreezeStoreEventHandler] request from player ${data.playerId}`);
    
    const player = getPlayerFromRoom(data.gameRoomId, data.playerId);

    // Make sure they provided an actual energy card
    const energyCard = _.nth(player.hand.cards, data.handEnergyPosition);
    if (energyCard === undefined)
        return failure('Energy card provided did not exist');

    if (energyCard.type !== CardType.Energy)
        return failure(`Card at position ${data.handEnergyPosition} was not an energy card`);

    _.pullAt(player.hand.cards, data.handEnergyPosition);

    const gameRoom = gameRooms.find(r => r.room.id === data.gameRoomId);
    gameRoom.generateStoreForPlayer(player);

    return success(player);
});