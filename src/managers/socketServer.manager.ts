import socketio from 'socket.io';
import joinGameRoomEventHandler from './../handlers/joinGameRoomEventHandler';

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

const start = (port: number) => {
    server.listen(port);
}

export { start, server }