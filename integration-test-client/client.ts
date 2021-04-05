import socketio from 'socket.io-client';
import dotenv from 'dotenv';
import JoinGameRoomEventMessage from './../src/models/joinGameRoomEventMessage';

dotenv.config();

const client = socketio(process.env.INTEGRATION_TEST_SERVER_SOCKET_ADDRESS);

client.on('connect', () => {
    console.log('connected to server');
    
    console.log('before emit');
    const message: JoinGameRoomEventMessage = {
        gameRoomId: "testGameRoomId2",
        playerId: "testPlayerId",
        playerUsername: "testPlayerUsername"
    }
    client.emit("joinGameRoom", message, (response: any) => {
        console.log(response);
    });
    console.log('after emit');
});

client.on("disconnect", () => {
    console.log('disconnected from server');
});
