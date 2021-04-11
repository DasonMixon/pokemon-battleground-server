import socketio from 'socket.io';
import { getPlayerFromRoom, startingTierUpCosts } from './../managers/gameRoom.manager';
import _ from 'lodash';
import { registerHandler } from './BaseEventHandler';
import logger from './../logging/logger';
import FreezeStoreEventMessage from './../models/FreezeStoreEventMessage';
import { IPlayer } from './../models/gameroom';

export default (socket: socketio.Socket) => registerHandler<FreezeStoreEventMessage, IPlayer>(socket, 'freezeStore', (data: FreezeStoreEventMessage, success, failure) => {
    logger.debug(`Starting [FreezeStoreEventHandler] request from player ${data.playerId}`);

    const player = getPlayerFromRoom(data.gameRoomId, data.playerId);

    player.store.frozen = !player.store.frozen;

    return success(player);
});