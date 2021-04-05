import socketio from 'socket.io';
import JoinGameRoomEventMessage from './../models/joinGameRoomEventMessage';
import { gameRooms } from './../managers/gameRoom.manager';
import { GameRoom } from './../models/gameroom';
import { server } from './../managers/socketServer.manager';
import GameStartedEventMessage from './../models/gameStartedEventMessage';

const joinGameRoomEventHandler = (socket: socketio.Socket) => 
    socket.on('joinGameRoom', (data: JoinGameRoomEventMessage, callback: any) => {
        console.log('got joinGameRoom event');

        let gameRoom = gameRooms.find(gr => gr.room.id === data.gameRoomId);
        if (gameRoom === undefined) {
            // Game room doesn't exist, so let's create it
            gameRoom = new GameRoom(data.gameRoomId);
            gameRooms.push(gameRoom);
        }

        const player = {
            id: data.playerId,
            username: data.playerUsername,
            board: {
                activePokemon: new Array()
            },
            currentPlacement: gameRoom.room.players.length + 1,
            hand: {
                cards: new Array()
            },
            store: {
                availablePokemon: new Array()
            }
        };
        gameRoom.room.players.push(player);

        // Let the player who just joined their player details
        callback(player);

        // Add player to the socket room
        socket.join(gameRoom.room.id);

        // If all players have joined, emit an event letting everyone know the game is now starting
        if (gameRoom.room.players.length === 8) {
            const gameStarted: GameStartedEventMessage = {
                gameRoomId: gameRoom.room.id
            };
            server.to(gameRoom.room.id).emit('gameStarted', gameStarted);
        }
    });

export default joinGameRoomEventHandler;