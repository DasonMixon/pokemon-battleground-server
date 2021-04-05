class GameRoom {
    room: IGameRoom;

    constructor(id: string) {
        this.room = {
            id,
            players: new Array(),
            cardPool: new Array()
        };
    }
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

export { GameRoom }