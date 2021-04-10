import { CardType, EnergyType, ICard } from './../models/gameroom';

const availablePokemon: ICard[] = [
    {
        imageId: 'TODO: Implement a system to provide image assets + their ids to clients',
        name: 'example pokemon',
        attachedEnergy: [],
        attacks: [
            {
                name: 'example attack 1',
                energyCost: [
                    EnergyType.Grass,
                    EnergyType.Grass
                ],
                damage: 5,
                ordinalPosition: 0
            },
            {
                name: 'example attack 2',
                energyCost: [
                    EnergyType.Grass,
                    EnergyType.Grass,
                    EnergyType.Water
                ],
                damage: 15,
                ordinalPosition: 1
            }
        ],
        energyType: EnergyType.Grass,
        maxHealth: 10,
        type: CardType.Pokemon
    }
];

export default availablePokemon;