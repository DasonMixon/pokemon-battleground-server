import socketio from 'socket.io';
import PokemonBoughtEventMessage from './../models/PokemonBoughtEventMessage';
import { gameRooms } from './../managers/gameRoom.manager';
import _ from 'lodash';

export default (socket: socketio.Socket) => {
    socket.on('pokemonBought', (data: PokemonBoughtEventMessage, callback: any) => {
        const gameRoom = gameRooms.find(gr => gr.room.id === data.gameRoomId);
        if (gameRoom === undefined)
            throw new Error(`[PokemonBoughtEventHandler] GameRoom with id ${gameRoom} does not exist.`);
        
        const player = gameRoom.room.players.find(p => p.id === data.playerId);
        if (player === undefined)
            throw new Error(`[PokemonBoughtEventHandler] Player with id ${data.playerId} does not exist in room ${gameRoom}.`);

        // First lets get what pokemon they're trying to buy
        const targetPokemon = player.store.availablePokemon.length > data.pokemonStorePosition
            ? undefined
            : player.store.availablePokemon[data.pokemonStorePosition];

        if (targetPokemon === undefined)
            throw new Error(`[PokemonBoughtEventHandler] Store pokemon with position ${data.pokemonStorePosition} does not exist.`);

        // Then lets make sure the player has the correct amount of the right type of energy to buy it
        const playerCanAfford = player.hand.cards.filter(c => c.energyType === targetPokemon.energyType).length >= 3;
        if (!playerCanAfford)
            throw new Error(`[PokemonBoughtEventHandler] Player ${data.playerId} cannot affort store pokemon at position ${data.pokemonStorePosition}.`);
        
        // And finally lets take away their energy, give them the card and remove it from the store
        let removalCount = 0;
        _.remove(player.hand.cards, c => {
            if (removalCount === 3)
                return false;

            const shouldRemove = c.energyType === targetPokemon.energyType;
            if (shouldRemove)
                removalCount += 1;

            return shouldRemove;
        });

        player.hand.cards.push(targetPokemon);

        _.remove(player.store.availablePokemon, targetPokemon);
    });
}