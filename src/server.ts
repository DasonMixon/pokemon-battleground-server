import socketio from 'socket.io';
import dotenv from 'dotenv';
import joinGameRoomEventHandler from './handlers/joinGameRoomEventHandler';

dotenv.config();

const port = parseInt(process.env.PORT) || 8080;
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
        console.log(`Socket '${socket.id}' disconnected`);
    });

    joinGameRoomEventHandler(socket);
});

server.listen(port);