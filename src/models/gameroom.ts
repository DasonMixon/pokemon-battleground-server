import { server } from './../managers/socketServer.manager';
import GameRoomPhaseEndedEventMessage from './gameRoomPhaseEndedEventMessage';
import GameRoomPhaseTimeLeftUpdatedEventMessage from './gameRoomPhaseTimeLeftUpdatedEventMessage';
import _ from 'lodash';

class GameRoom {
    room: IGameRoom;
    gameLoop: any;
    currentPhase: Phase;
    phaseTimeLeft: number;
    currentRound: number;
    playerMatchups: Array<IBattlePhasePlayerMatchup>;

    constructor(id: string) {
        this.room = {
            id,
            players: new Array(),
            cardPool: new Array()
        };
    }

    public startGame = () => {
        this.currentRound = 1;
        this.currentPhase = Phase.RecruitPhase;
        this.phaseTimeLeft = this.getPhaseTimeLeftStart();
        this.generatePlayerMatchups();

        // Start the game loop
        this.gameLoop = setInterval(() => {
            this.phaseTimeLeft -= 1;

            // Emit an event to all clients letting them know the phaseTimeLeft has been updated
            const phaseTimeLeft: GameRoomPhaseTimeLeftUpdatedEventMessage = {
                gameRoomId: this.room.id,
                phaseTimeLeft: this.phaseTimeLeft
            };
            server.to(this.room.id).emit('GameRoomPhaseTimeLeftUpdated', phaseTimeLeft);

            // If the phase isn't over yet just skip processing
            if (this.phaseTimeLeft > 0)
                return;

            // The time left has ended, swap the phase, do any phase specific logic
            // and let all clients know we're on a new phase
            const oldPhase = this.currentPhase;
            if (this.currentPhase === Phase.RecruitPhase) {
                this.currentPhase = Phase.BattlePhase;
            } else if (this.currentPhase === Phase.BattlePhase) {
                this.currentPhase = Phase.RecruitPhase;
            }

            // Let all clients know the game phase ended
            const phaseEnded: GameRoomPhaseEndedEventMessage = {
                gameRoomId: this.room.id,
                oldPhase: oldPhase,
                newPhase: this.currentPhase
            };
            server.to(this.room.id).emit('GameRoomPhaseEnded', phaseEnded);

            // TODO: If we just left the recruit phase, then we need to simulate the battle attacks order
            // between each player matchup. Flip a coin to see who makes first attack, then start with
            // their left most minion, do the attack, then switch to the other player's left most minion
            // and do the attack. Keep doing this until one or both of the player's active pokemon are
            // cleared out.
            if (oldPhase === Phase.RecruitPhase) {

            }

            if (oldPhase === Phase.BattlePhase) {
                this.generatePlayerMatchups();
                this.currentRound += 1;
            }

            // TODO: If we just left the battle phase, then we need to determine if the current player was
            // knocked out or not. If they were, then their game is over, adjust their MMR accordingly.
            // Also generate a new set of player matchups. Also bump the currentRound anytime after a battle phase.

            this.phaseTimeLeft = this.getPhaseTimeLeftStart();
        }, 1000);
    }

    private getPhaseTimeLeftStart = (): number => {
        // For now just do something simle, this will need tweaked later
        return 60 + (this.currentRound * 10);
    }

    private generatePlayerMatchups = () => {
        this.playerMatchups = new Array();

        const playersStillAlive = this.room.players.filter(p => p.knockedOut === false);
        while(playersStillAlive.length > 0) {
            const currentPlayer = _.sample(playersStillAlive);
            _.remove(playersStillAlive, currentPlayer);

            if (playersStillAlive.length === 1) {
                // We're on the last one, they need to battle the most recent player that was knocked out
                const knockedOutPlayers = this.room.players.filter(p => p.knockedOut === true);
                const mostRecentKnockedOutPlayer = _.maxBy(knockedOutPlayers, p => p.roundKnockedOut);
                this.playerMatchups.push({ playerIds: new Array(currentPlayer.id, mostRecentKnockedOutPlayer.id) });
            } else {
                const randomMatchup = _.sample(playersStillAlive);
                this.playerMatchups.push({ playerIds: new Array(currentPlayer.id, randomMatchup.id) });
                _.remove(playersStillAlive, randomMatchup);
            }
        }
    }

    private flipCoin(player1Id: string, player2Id: string) {
        return _.sample(new Array(player1Id, player2Id));
    }
}

interface IBattlePhasePlayerMatchup {
    playerIds: Array<string>;
}

interface IGameRoom {
    id: string;
    players: Array<IPlayer>;
    cardPool: Array<ICard>;
}

interface IPlayer {
    id: string;
    username: string;
    hand: IHand;
    board: IPlayerBoard;
    store: IStoreBoard;
    currentPlacement: number;
    knockedOut: boolean;
    roundKnockedOut: number;
}

interface IStoreBoard {
    availablePokemon: Array<ICard>;
}

interface IPlayerBoard {
    activePokemon: Array<IActivePokemon>;
}

interface IActivePokemon {
    pokemon: ICard;
    position: number;
}

interface IHand {
    cards: Array<ICard>;
}

interface ICard {
    type: CardType;
    energyType: EnergyType;
    attachedEnergy: Array<ICard>;
}

enum CardType {
    Pokemon = 1,
    Energy = 2
}

enum EnergyType {
    Grass = 1,
    Fire = 2,
    Water = 3,
    Lightning = 4,
    Psychic = 5,
    Fighting = 6,
    Darkness = 7,
    Metal = 8,
    Fairy = 9,
    Dragon = 10,
    Colorless = 11
}

enum Phase {
    RecruitPhase = 1,
    BattlePhase = 2
}

export { GameRoom, Phase }