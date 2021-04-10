import { ICard } from './../models/gameroom';
import { CardType, EnergyType } from './Enums';

const grassEnergy: ICard = {
    imageId: 'TODO: Implement a system to provide image assets + their ids to clients',
    name: 'Grass Energy',
    attachedEnergy: [],
    attacks: [],
    energyType: EnergyType.Grass,
    maxHealth: null,
    type: CardType.Energy,
    tier: null
}

const fireEnergy: ICard = {
    imageId: 'TODO: Implement a system to provide image assets + their ids to clients',
    name: 'Fire Energy',
    attachedEnergy: [],
    attacks: [],
    energyType: EnergyType.Fire,
    maxHealth: null,
    type: CardType.Energy,
    tier: null
}

const waterEnergy: ICard = {
    imageId: 'TODO: Implement a system to provide image assets + their ids to clients',
    name: 'Water Energy',
    attachedEnergy: [],
    attacks: [],
    energyType: EnergyType.Water,
    maxHealth: null,
    type: CardType.Energy,
    tier: null
}

const lightningEnergy: ICard = {
    imageId: 'TODO: Implement a system to provide image assets + their ids to clients',
    name: 'Lightning Energy',
    attachedEnergy: [],
    attacks: [],
    energyType: EnergyType.Lightning,
    maxHealth: null,
    type: CardType.Energy,
    tier: null
}

const psychicEnergy: ICard = {
    imageId: 'TODO: Implement a system to provide image assets + their ids to clients',
    name: 'Psychic Energy',
    attachedEnergy: [],
    attacks: [],
    energyType: EnergyType.Psychic,
    maxHealth: null,
    type: CardType.Energy,
    tier: null
}

const fightingEnergy: ICard = {
    imageId: 'TODO: Implement a system to provide image assets + their ids to clients',
    name: 'Fighting Energy',
    attachedEnergy: [],
    attacks: [],
    energyType: EnergyType.Fighting,
    maxHealth: null,
    type: CardType.Energy,
    tier: null
}

const darknessEnergy: ICard = {
    imageId: 'TODO: Implement a system to provide image assets + their ids to clients',
    name: 'Darkness Energy',
    attachedEnergy: [],
    attacks: [],
    energyType: EnergyType.Darkness,
    maxHealth: null,
    type: CardType.Energy,
    tier: null
}

const metalEnergy: ICard = {
    imageId: 'TODO: Implement a system to provide image assets + their ids to clients',
    name: 'Metal Energy',
    attachedEnergy: [],
    attacks: [],
    energyType: EnergyType.Metal,
    maxHealth: null,
    type: CardType.Energy,
    tier: null
}

const availableEnergy: ICard[] = [
    grassEnergy,
    fireEnergy,
    waterEnergy,
    lightningEnergy,
    psychicEnergy,
    fightingEnergy,
    darknessEnergy,
    metalEnergy
];

export {
    grassEnergy,
    fireEnergy,
    waterEnergy,
    lightningEnergy,
    psychicEnergy,
    fightingEnergy,
    darknessEnergy,
    metalEnergy
}
export default availableEnergy;