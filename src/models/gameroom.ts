import { server } from './../managers/socketServer.manager';
import GameRoomPhaseEndedEventMessage from './gameRoomPhaseEndedEventMessage';
import GameRoomPhaseTimeLeftUpdatedEventMessage from './gameRoomPhaseTimeLeftUpdatedEventMessage';
import _ from 'lodash';
import GameRoomPlayerChangedEventMessage from './gameRoomPlayerChangedEventMessage';
import GameRoomBattlePhaseOutcomeEventMessage from './gameRoomBattlePhaseOutcomeEventMessage';
import GameRoomEndedEventMessage from './gameRoomEnded';
import { getPokemonByEnergyType } from './../data/Pokemon';
import GameRoomDataEventMessage from './gameRoomDataEventMessage';
import { CardType, EnergyType, BattlePhaseEventType, Phase } from './../data/Enums';
import availableEnergy from './../data/Energy';

class GameRoom {
    room: IGameRoom;
    gameLoop: any;
    currentPhase: Phase;
    phaseTimeLeft: number;
    currentRound: number;
    playerMatchups: IBattlePhasePlayerMatchup[];
    inProgress: boolean;
    energyTypes: EnergyType[];

    constructor(id: string) {
        this.room = {
            id,
            players: new Array(),
            cardPool: new Array()
        };

        this.inProgress = false;
    }

    public startGame = () => {
        this.inProgress = true;
        this.currentRound = 1;
        this.currentPhase = Phase.RecruitPhase;
        this.phaseTimeLeft = this.getPhaseTimeLeftStart();
        this.generatePlayerMatchups();
        this.generateCardPool();
        this.room.players.forEach(p => {
            this.generateStoreForPlayer(p);

            // Each player will start with 5 random energy cards
            for (let i = 0; i < 5; i++) {
                this.givePlayerRandomEnergyCard(p);
            }
        });

        this.refreshRoomDataToPlayers();

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
                oldPhase,
                newPhase: this.currentPhase
            };
            server.to(this.room.id).emit('GameRoomPhaseEnded', phaseEnded);

            if (oldPhase === Phase.RecruitPhase) {
                this.playerMatchups.forEach(pm => this.simulateBattlePhase(
                    this.room.players.find(p => p.id === pm.playerIds[0]),
                    this.room.players.find(p => p.id === pm.playerIds[1])));
            }

            if (oldPhase === Phase.BattlePhase) {
                // Check if there's only one player left alive
                const remainingAlivePlayers = this.room.players.filter(p => !p.knockedOut);
                if (remainingAlivePlayers.length === 1) {
                    const msg: GameRoomEndedEventMessage = {
                        gameRoomId: this.room.id,
                        winningPlayerId: remainingAlivePlayers[0].id
                    };
                    server.to(this.room.id).emit('GameRoomEnded', msg);
                    clearInterval(this.gameLoop);
                } else {
                    this.room.players.forEach(p => {
                        // Decrease the tier up cost for all players by 1
                        if (p.tierUpCost > 0)
                            p.tierUpCost -= 1;

                        // Give each player 2 random energy cards after each round
                        this.givePlayerRandomEnergyCard(p);
                        this.givePlayerRandomEnergyCard(p);

                        // Give them a fresh store if they didn't freeze it last round
                        if (!p.store.frozen)
                            this.generateStoreForPlayer(p);
                    });

                    this.generatePlayerMatchups();
                    this.currentRound += 1;
                }
            }

            this.refreshRoomDataToPlayers();

            this.phaseTimeLeft = this.getPhaseTimeLeftStart();
        }, 1000);
    }

    private refreshRoomDataToPlayers = () => {
        this.room.players.forEach(p => {
            const msg: GameRoomDataEventMessage = {
                currentPhase: this.currentPhase,
                currentRound: this.currentRound,
                gameRoomId: this.room.id,
                player: p,
                playerMatchups: this.playerMatchups
            };
            server.to(p.socketId).emit('GameRoomData', msg);
        });
    }

    private generateCardPool = () => {
        this.room.cardPool = [];
        this.energyTypes = _.sampleSize(Object.values(EnergyType).filter(e => e !== EnergyType.Colorless), 3);
        this.energyTypes.forEach(et => {
            const pokemonOfEnergyType = getPokemonByEnergyType(et);
            pokemonOfEnergyType.forEach(p => {
                this.room.cardPool = this.room.cardPool.concat(this.getPokemonForTier(p));
            });
        });
    }

    private givePlayerRandomEnergyCard = (player: IPlayer) => {
        const randomType = _.sample(this.energyTypes);
        const randomEnergyCard = availableEnergy.find(e => e.energyType === randomType);
        player.hand.cards.push(randomEnergyCard);
    }

    private getPokemonForTier = (pokemon: ICard): ICard[] => {
        switch(pokemon.tier) {
            case 1:
                return Array(18).fill(pokemon);
            case 2:
                return Array(15).fill(pokemon);
            case 3:
                return Array(13).fill(pokemon);
            case 4:
                return Array(11).fill(pokemon);
            case 5:
                return Array(9).fill(pokemon);
            case 6:
                return Array(6).fill(pokemon);
            default:
                return [];
        }
    }

    private generateStoreForPlayer = (player: IPlayer) => {
        // TODO: Make it so that the cardpool is locked while recycling and refreshing the player's store cards
        const currentStoreCards = player.store.availablePokemon;
        const newStoreCards = _.sampleSize(this.room.cardPool.filter(c => c.tier <= player.currentTier), this.getStoreCountForTier(player));
        newStoreCards.forEach(c => _.remove(this.room.cardPool, c));
        this.room.cardPool = this.room.cardPool.concat(currentStoreCards);
        player.store.availablePokemon = newStoreCards;
    }

    private getStoreCountForTier = (player: IPlayer): number => {
        switch(player.currentTier) {
            case 1:
                return 3;
            case 2:
                return 4;
            case 3:
                return 4;
            case 4:
                return 5;
            case 5:
                return 5;
            case 6:
                return 6;
            default:
                return 0;
        }
    }

    private getPhaseTimeLeftStart = (): number => {
        // For now just do something simle, this will need tweaked later
        //return 60 + (this.currentRound * 10);
        return 10;
    }

    private generatePlayerMatchups = () => {
        this.playerMatchups = new Array();

        const playersStillAlive = this.room.players.filter(p => p.knockedOut === false);
        while(playersStillAlive.length > 0) {
            if (playersStillAlive.length >= 2) {
                // Grab two random players as a matchup, remove them from the player list
                const players = _.sampleSize(playersStillAlive, 2);
                this.playerMatchups.push({ playerIds: players.map(p => p.id) });
                _.remove(playersStillAlive, players[0]);
                _.remove(playersStillAlive, players[1]);
            } else if (playersStillAlive.length === 1) {
                // Only one player left, they need to fight the most recently knocked out person
                const currentPlayer = _.sample(playersStillAlive);
                const knockedOutPlayers = this.room.players.filter(p => p.knockedOut === true);
                const mostRecentKnockedOutPlayer = _.maxBy(knockedOutPlayers, p => p.roundKnockedOut);
                this.playerMatchups.push({ playerIds: new Array(currentPlayer.id, mostRecentKnockedOutPlayer.id) });
                _.remove(playersStillAlive, currentPlayer);
            }
        }
    }

    private flipCoin(item1: any, item2: any) {
        return _.sample(new Array(item1, item2));
    }

    private simulateBattlePhase(player1: IPlayer, player2: IPlayer): IBattlePhaseResult {
        const battlePhaseEvents: IBattlePhaseEvent[] = [];

        let currentPlayer: IPlayer = null;
        let firstPlayerToAttack: IPlayer;

        const getOtherPlayer = (): IPlayer => {
            return currentPlayer.id === player1.id ? player2 : player1;
        }

        let simulationOver = false;
        let winner: IPlayer | null;
        let damageGiven: number;
        while(!simulationOver) {
            if (currentPlayer === null) {
                currentPlayer = this.flipCoin(player1, player2);
                firstPlayerToAttack = { ...currentPlayer };
                battlePhaseEvents.push({
                    attackingPlayer: currentPlayer.id,
                    attackingPokemonAttackUsed: null,
                    attackingPokemonPosition: -1,
                    damageDealt: 0,
                    defendingPlayer: getOtherPlayer().id,
                    defendingPokemonPosition: -1,
                    eventType: BattlePhaseEventType.CoinFlip
                });
            } else {
                currentPlayer = getOtherPlayer();
            }

            // Check if simulation is done and if so who won and how much damage they should be doing
            if (player1.board.activePokemon.filter(p => p.currentHealth > 0).length === 0 &&
                player2.board.activePokemon.filter(p => p.currentHealth > 0).length === 0) {
                // Was a tie
                winner = null;
                damageGiven = 0;

                battlePhaseEvents.push({
                    attackingPlayer: null,
                    attackingPokemonAttackUsed: null,
                    attackingPokemonPosition: -1,
                    damageDealt: damageGiven,
                    defendingPlayer: null,
                    defendingPokemonPosition: -1,
                    eventType: BattlePhaseEventType.Draw
                });

                simulationOver = true;
                continue;
            }

            if (player1.board.activePokemon.filter(p => p.currentHealth > 0).length === 0) {
                winner = player2;
                damageGiven = player2.board.activePokemon.length;

                player1.currentHealth -= damageGiven;
                battlePhaseEvents.push({
                    attackingPlayer: player2.id,
                    attackingPokemonAttackUsed: null,
                    attackingPokemonPosition: -1,
                    damageDealt: damageGiven,
                    defendingPlayer: player1.id,
                    defendingPokemonPosition: -1,
                    eventType: BattlePhaseEventType.PlayerAttack
                });

                if (player1.currentHealth <= 0) {
                    player1.roundKnockedOut = this.currentRound;
                    battlePhaseEvents.push({
                        attackingPlayer: player2.id,
                        attackingPokemonAttackUsed: null,
                        attackingPokemonPosition: -1,
                        damageDealt: damageGiven,
                        defendingPlayer: player1.id,
                        defendingPokemonPosition: -1,
                        eventType: BattlePhaseEventType.PlayerKnockedOut
                    });
                }

                simulationOver = true;
                continue;
            }

            if (player2.board.activePokemon.filter(p => p.currentHealth > 0).length === 0) {
                winner = player1;
                damageGiven = player1.board.activePokemon.length;

                player2.currentHealth -= damageGiven;
                battlePhaseEvents.push({
                    attackingPlayer: player1.id,
                    attackingPokemonAttackUsed: null,
                    attackingPokemonPosition: -1,
                    damageDealt: damageGiven,
                    defendingPlayer: player2.id,
                    defendingPokemonPosition: -1,
                    eventType: BattlePhaseEventType.PlayerAttack
                });

                if (player2.currentHealth <= 0) {
                    player2.roundKnockedOut = this.currentRound;
                    battlePhaseEvents.push({
                        attackingPlayer: player1.id,
                        attackingPokemonAttackUsed: null,
                        attackingPokemonPosition: -1,
                        damageDealt: damageGiven,
                        defendingPlayer: player2.id,
                        defendingPokemonPosition: -1,
                        eventType: BattlePhaseEventType.PlayerKnockedOut
                    });
                }

                simulationOver = true;
                continue;
            }

            // Run a round of the simulation
            const pokemonWhoCanAttack = currentPlayer.board.activePokemon.filter(p => p.currentHealth > 0 && !p.hasAttacked);
            if (pokemonWhoCanAttack.length === 0)
                continue;

            const attackingPokemon = pokemonWhoCanAttack[0];
            const defendingPokemon = _.sample(getOtherPlayer().board.activePokemon.filter(p => p.currentHealth > 0));
            // See whether the attacking pokemon has correct energy for one of their attacks. If not they get "skipped", else
            // they use whatever the "highest" attack they have that matches their current energies
            const availableAttacks = attackingPokemon.pokemon.attacks.filter(at => {
                const attachedEnergyTypes = attackingPokemon.pokemon.attachedEnergy.map(ae => ae.energyType);
                at.energyCost.forEach(ec => {
                    const fromAttachedEnergies = attachedEnergyTypes.find(a => a === ec);
                    if (fromAttachedEnergies === undefined)
                        return false;
                    _.remove(attachedEnergyTypes, fromAttachedEnergies);
                });

                return true;
            });
            const highestAttack = availableAttacks.length === 0 ? null : _.maxBy(availableAttacks, a => a.ordinalPosition);
            attackingPokemon.hasAttacked = true;
            if (highestAttack === null) {
                battlePhaseEvents.push({
                    attackingPlayer: currentPlayer.id,
                    attackingPokemonAttackUsed: null,
                    attackingPokemonPosition: attackingPokemon.position,
                    damageDealt: 0,
                    defendingPlayer: getOtherPlayer().id,
                    defendingPokemonPosition: defendingPokemon.position,
                    eventType: BattlePhaseEventType.ActivePokemonAttack
                });
                continue;
            }

            defendingPokemon.currentHealth -= highestAttack.damage;
            battlePhaseEvents.push({
                attackingPlayer: currentPlayer.id,
                attackingPokemonAttackUsed: highestAttack,
                attackingPokemonPosition: attackingPokemon.position,
                damageDealt: highestAttack.damage,
                defendingPlayer: getOtherPlayer().id,
                defendingPokemonPosition: defendingPokemon.position,
                eventType: BattlePhaseEventType.ActivePokemonAttack
            });

            if (defendingPokemon.currentHealth <= 0) {
                battlePhaseEvents.push({
                    attackingPlayer: currentPlayer.id,
                    attackingPokemonAttackUsed: highestAttack,
                    attackingPokemonPosition: attackingPokemon.position,
                    damageDealt: 0,
                    defendingPlayer: getOtherPlayer().id,
                    defendingPokemonPosition: defendingPokemon.position,
                    eventType: BattlePhaseEventType.ActivePokemonKnockedOut
                });
                continue;
            }
        }

        // Let all players know the status of these two players after the simulation results
        const player1Details: GameRoomPlayerChangedEventMessage = {
            currentHealth: player1.currentHealth,
            playerId: player1.id,
            wasKnockedOut: player1.knockedOut
        };
        server.to(this.room.id).emit('GameRoomPlayerChanged', player1Details);

        const player2Details: GameRoomPlayerChangedEventMessage = {
            currentHealth: player2.currentHealth,
            playerId: player2.id,
            wasKnockedOut: player2.knockedOut
        };
        server.to(this.room.id).emit('GameRoomPlayerChanged', player2Details);

        const result: IBattlePhaseResult = {
            events: battlePhaseEvents,
            firstAttackingPlayer: firstPlayerToAttack.id,
            winningPlayer: winner?.id
        };

        const msg: GameRoomBattlePhaseOutcomeEventMessage = { result };

        // Let only these two players know their battle outcomes
        server.to(player1.socketId).emit('GameRoomBattlePhaseOutcome', msg);
        server.to(player2.socketId).emit('GameRoomBattlePhaseOutcome', msg);

        // TODO: Either as part of this method or somewhere adjust the loser's MMR and send it to them

        return result;
    }
}

interface IBattlePhaseResult {
    events: IBattlePhaseEvent[];
    firstAttackingPlayer: string;
    winningPlayer: string;
}

interface IBattlePhasePlayerMatchup {
    playerIds: string[];
}

interface IBattlePhaseEvent {
    eventType: BattlePhaseEventType;
    attackingPlayer: string;
    attackingPokemonPosition: number;
    attackingPokemonAttackUsed: IAttack | null;
    defendingPlayer: string;
    defendingPokemonPosition: number;
    damageDealt: number;
}

interface IGameRoom {
    id: string;
    players: IPlayer[];
    cardPool: ICard[];
}

interface IPlayer {
    id: string;
    username: string;
    hand: IHand;
    board: IPlayerBoard;
    store: IStoreBoard;
    currentPlacement: number;
    maxHealth: number;
    currentHealth: number;
    knockedOut: boolean;
    roundKnockedOut: number;
    socketId: string;
    currentTier: number;
    tierUpCost: number;
}

interface IStoreBoard {
    availablePokemon: ICard[];
    frozen: boolean;
}

interface IPlayerBoard {
    activePokemon: IActivePokemon[];
}

interface IActivePokemon {
    pokemon: ICard;
    position: number;
    currentHealth: number;
    hasAttacked: boolean;
}

interface IAttack {
    name: string;
    ordinalPosition: number;
    energyCost: EnergyType[];
    damage: number;
}

interface IHand {
    cards: ICard[];
}

interface ICard {
    imageId: string;
    name: string;
    type: CardType;
    energyType: EnergyType;
    attachedEnergy: ICard[];
    maxHealth: number;
    attacks: IAttack[];
    tier: number | null;
}

export { GameRoom, IBattlePhaseResult, IPlayer, ICard, IBattlePhasePlayerMatchup }