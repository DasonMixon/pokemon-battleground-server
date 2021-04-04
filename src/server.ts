import ws from 'ws';
import dotenv from 'dotenv';
import { ISocketMessage } from './models/socketmessage';

dotenv.config();

const port = parseInt(process.env.PORT) || 8080;
const server = new ws.Server({ port }, () => {
    console.log('Web socket server started');
});

server.on('connection', (socket) => {
    socket.on('message', (data: ISocketMessage) => {
        console.log(`Data received from client: ${data}`);
        socket.send(data);
    });
});

server.on('listening', () => {
    console.log(`Listening on port ${port}`);
});