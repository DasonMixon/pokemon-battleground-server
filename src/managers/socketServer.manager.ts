import socketio from 'socket.io';
import joinGameRoomEventHandler from './../handlers/joinGameRoomEventHandler';
import pokemonBoughtEventHandler from './../handlers/pokemonBoughtEventHandler';
import { gameRooms, socketGameRoomAssociations } from './gameRoom.manager';
import _ from'lodash';
import logger from './../logging/logger';

const server = new socketio.Server();

/*
    Events:
        *Misc events*
        ping
        join
        leave
        
        *Player events*
        tierup
        recruitpokemon
        sellpokemon
        freezebench
        reorderpokemon
        playpokemon
        attachenergy
*/
server.on('connection', socket => {
    logger.info(`Connection from socket '${socket.id}'`);

    socket.on('disconnect', () => {
        const socketGameRoom = socketGameRoomAssociations.find(gra => gra.socketId === socket.id);
        if (socketGameRoom !== undefined) {
            // Remove the socket player from the game room they're currently in
            const gameRoom = gameRooms.find(gr => gr.room.id === socketGameRoom.gameRoomId);
            _.remove(gameRoom.room.players, p => p.socketId === socket.id);
        }

        logger.info(`Socket '${socket.id}' disconnected`);
    });

    joinGameRoomEventHandler(socket);
    pokemonBoughtEventHandler(socket);
});

const start = (port: number) => {
    server.listen(port);
    logger.info(`WS server started on port ${port}`);
}

export { start, server }