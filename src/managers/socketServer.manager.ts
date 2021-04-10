import socketio from 'socket.io';
import joinGameRoomEventHandler from './../handlers/joinGameRoomEventHandler';
import pokemonBoughtEventHandler from './../handlers/pokemonBoughtEventHandler';
import { gameRooms, socketGameRoomAssociations } from './gameRoom.manager';
import _ from'lodash';

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
    console.log(`Connection from socket '${socket.id}'`);

    socket.on('disconnect', () => {
        const socketGameRoom = socketGameRoomAssociations.find(gra => gra.socketId === socket.id);
        if (socketGameRoom !== undefined) {
            // Remove the socket player from the game room they're currently in
            const gameRoom = gameRooms.find(gr => gr.room.id === socketGameRoom.gameRoomId);
            _.remove(gameRoom.room.players, p => p.socketId === socket.id);
        }

        console.log(`Socket '${socket.id}' disconnected`);
    });

    joinGameRoomEventHandler(socket);
    pokemonBoughtEventHandler(socket);
});

const start = (port: number) => {
    server.listen(port);
    console.log(`WS server started on port ${port}`);
}

export { start, server }