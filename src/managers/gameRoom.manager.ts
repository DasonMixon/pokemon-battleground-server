import { GameRoom } from "./../models/gameroom";

const gameRooms = new Array<GameRoom>();
const socketGameRoomAssociations = new Array<{ gameRoomId: string, socketId: string }>();

export { gameRooms, socketGameRoomAssociations }