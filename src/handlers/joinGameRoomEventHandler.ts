import socketio from 'socket.io';
import JoinGameRoomEventMessage from './../models/joinGameRoomEventMessage';
import { gameRooms, socketGameRoomAssociations } from './../managers/gameRoom.manager';
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

        if (gameRoom.inProgress) {
            // Don't let someone join if the game is in progress
            callback('Unable to join game in progress');
            return;
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
            },
            socketId: socket.id,
            maxHealth: 40,
            currentHealth: 40,
            knockedOut: false,
            roundKnockedOut: 0
        };
        gameRoom.room.players.push(player);
        socketGameRoomAssociations.push({ gameRoomId: gameRoom.room.id, socketId: socket.id });

        // Let the player who just joined their player details
        callback(player);

        // Add player to the socket room
        socket.join(gameRoom.room.id);

        // If all players have joined, emit an event letting everyone know the game is now starting
        if (gameRoom.room.players.length === 2) {
            const gameStarted: GameStartedEventMessage = {
                gameRoomId: gameRoom.room.id
            };
            server.to(gameRoom.room.id).emit('gameStarted', gameStarted);

            gameRoom.startGame();
        }
    });

export default joinGameRoomEventHandler;