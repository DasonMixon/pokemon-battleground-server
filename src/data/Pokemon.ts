import { ICard } from './../models/gameroom';
import { CardType, EnergyType } from './Enums';

const lightningPokemon: ICard[] = [
    {
        imageId: '',
        name: 'Voltorb',
        attacks: [
            {
                name: 'Electro Ball',
                energyCost: [
                    EnergyType.Lightning,
                    EnergyType.Lightning
                ],
                damage: 40,
                ordinalPosition: 0
            }
        ],
        energyType: EnergyType.Lightning,
        maxHealth: 60,
        type: CardType.Pokemon,
        tier: 1
    },
    {
        imageId: '',
        name: 'Electrode',
        attacks: [
            {
                name: 'Electric Ball',
                energyCost: [
                    EnergyType.Lightning,
                    EnergyType.Lightning,
                    EnergyType.Colorless
                ],
                damage: 100,
                ordinalPosition: 0
            }
        ],
        energyType: EnergyType.Lightning,
        maxHealth: 90,
        type: CardType.Pokemon,
        tier: 2
    }
];

const grassPokemon: ICard[] = [
    {
        imageId: '',
        name: 'Yanma',
        attacks: [
            {
                name: 'U-turn',
                energyCost: [
                    EnergyType.Colorless
                ],
                damage: 10,
                ordinalPosition: 0
            }
        ],
        energyType: EnergyType.Grass,
        maxHealth: 80,
        type: CardType.Pokemon,
        tier: 1
    },
    {
        imageId: '',
        name: 'Yanmega',
        attacks: [
            {
                name: 'U-turn',
                energyCost: [
                    EnergyType.Colorless,
                    EnergyType.Colorless
                ],
                damage: 50,
                ordinalPosition: 0
            },
            {
                name: 'Cutting Wind',
                energyCost: [
                    EnergyType.Colorless,
                    EnergyType.Colorless,
                    EnergyType.Colorless,
                    EnergyType.Colorless
                ],
                damage: 130,
                ordinalPosition: 1
            }
        ],
        energyType: EnergyType.Grass,
        maxHealth: 130,
        type: CardType.Pokemon,
        tier: 2
    }
];

const fightingPokemon: ICard[] = [
    {
        imageId: '',
        name: 'Clobbopus',
        attacks: [
            {
                name: 'Beat',
                energyCost: [
                    EnergyType.Fighting
                ],
                damage: 20,
                ordinalPosition: 0
            },
            {
                name: 'Hammer In',
                energyCost: [
                    EnergyType.Fighting,
                    EnergyType.Colorless
                ],
                damage: 40,
                ordinalPosition: 1
            }
        ],
        energyType: EnergyType.Fighting,
        maxHealth: 80,
        type: CardType.Pokemon,
        tier: 1
    },
    {
        imageId: '',
        name: 'Riolu',
        attacks: [
            {
                name: 'Best Punch',
                energyCost: [
                    EnergyType.Colorless
                ],
                damage: 30,
                ordinalPosition: 0
            }
        ],
        energyType: EnergyType.Fighting,
        maxHealth: 70,
        type: CardType.Pokemon,
        tier: 2
    }
];

const metalPokemon: ICard[] = [
    {
        imageId: '',
        name: 'Galarian Meowth',
        attacks: [
            {
                name: 'Scratch',
                energyCost: [
                    EnergyType.Metal
                ],
                damage: 10,
                ordinalPosition: 0
            },
            {
                name: 'Fury Swipes',
                energyCost: [
                    EnergyType.Metal,
                    EnergyType.Colorless
                ],
                damage: 20,
                ordinalPosition: 1
            }
        ],
        energyType: EnergyType.Metal,
        maxHealth: 70,
        type: CardType.Pokemon,
        tier: 1
    },
    {
        imageId: '',
        name: 'Galarian Perrserker',
        attacks: [
            {
                name: 'Stealy Claws',
                energyCost: [
                    EnergyType.Metal
                ],
                damage: 20,
                ordinalPosition: 0
            },
            {
                name: 'Claw Slash',
                energyCost: [
                    EnergyType.Metal,
                    EnergyType.Colorless,
                    EnergyType.Colorless
                ],
                damage: 90,
                ordinalPosition: 1
            }
        ],
        energyType: EnergyType.Metal,
        maxHealth: 120,
        type: CardType.Pokemon,
        tier: 2
    }
];

const psychicPokemon: ICard[] = [
    {
        imageId: '',
        name: 'Cottonee',
        attacks: [
            {
                name: 'Rolling Tackle',
                energyCost: [
                    EnergyType.Psychic
                ],
                damage: 10,
                ordinalPosition: 0
            }
        ],
        energyType: EnergyType.Psychic,
        maxHealth: 60,
        type: CardType.Pokemon,
        tier: 1
    },
    {
        imageId: '',
        name: 'Xerneas',
        attacks: [
            {
                name: 'Geo Hunt',
                energyCost: [
                    EnergyType.Psychic
                ],
                damage: 0,
                ordinalPosition: 0
            },
            {
                name: 'Aurora Gain',
                energyCost: [
                    EnergyType.Psychic,
                    EnergyType.Psychic,
                    EnergyType.Colorless
                ],
                damage: 100,
                ordinalPosition: 1
            }
        ],
        energyType: EnergyType.Psychic,
        maxHealth: 130,
        type: CardType.Pokemon,
        tier: 2
    },
];

const waterPokemon: ICard[] = [
    {
        imageId: '',
        name: 'Chewtle',
        attacks: [
            {
                name: 'Jaw Lock',
                energyCost: [
                    EnergyType.Water,
                    EnergyType.Colorless
                ],
                damage: 40,
                ordinalPosition: 0
            }
        ],
        energyType: EnergyType.Water,
        maxHealth: 80,
        type: CardType.Pokemon,
        tier: 1
    },
    {
        imageId: '',
        name: 'Drednaw',
        attacks: [
            {
                name: 'Vise Wave',
                energyCost: [
                    EnergyType.Water,
                    EnergyType.Colorless,
                    EnergyType.Colorless
                ],
                damage: 80,
                ordinalPosition: 0
            },
            {
                name: 'Surf',
                energyCost: [
                    EnergyType.Water,
                    EnergyType.Water,
                    EnergyType.Colorless,
                    EnergyType.Colorless
                ],
                damage: 140,
                ordinalPosition: 1
            }
        ],
        energyType: EnergyType.Water,
        maxHealth: 140,
        type: CardType.Pokemon,
        tier: 2
    }
];

const darknessPokemon: ICard[] = [
    {
        imageId: '',
        name: 'Sableye',
        attacks: [
            {
                name: 'Filch',
                energyCost: [
                    EnergyType.Colorless
                ],
                damage: 0,
                ordinalPosition: 0
            },
            {
                name: 'Torment',
                energyCost: [
                    EnergyType.Colorless,
                    EnergyType.Colorless
                ],
                damage: 30,
                ordinalPosition: 1
            }
        ],
        energyType: EnergyType.Darkness,
        maxHealth: 70,
        type: CardType.Pokemon,
        tier: 1
    },
    {
        imageId: '',
        name: 'Poochyena',
        attacks: [
            {
                name: 'Bite',
                energyCost: [
                    EnergyType.Darkness
                ],
                damage: 10,
                ordinalPosition: 0
            },
            {
                name: 'Rear Kick',
                energyCost: [
                    EnergyType.Colorless,
                    EnergyType.Colorless
                ],
                damage: 20,
                ordinalPosition: 1
            }
        ],
        energyType: EnergyType.Darkness,
        maxHealth: 70,
        type: CardType.Pokemon,
        tier: 1
    }
];

const firePokemon: ICard[] = [
    {
        imageId: '',
        name: 'Charmander',
        attacks: [
            {
                name: 'Collect',
                energyCost: [
                    EnergyType.Fire
                ],
                damage: 0,
                ordinalPosition: 0
            },
            {
                name: 'Flare',
                energyCost: [
                    EnergyType.Fire,
                    EnergyType.Fire
                ],
                damage: 30,
                ordinalPosition: 1
            }
        ],
        energyType: EnergyType.Fire,
        maxHealth: 70,
        type: CardType.Pokemon,
        tier: 1
    },
    {
        imageId: '',
        name: 'Charmeleon',
        attacks: [
            {
                name: 'Slash',
                energyCost: [
                    EnergyType.Fire
                ],
                damage: 20,
                ordinalPosition: 0
            },
            {
                name: 'Raging Flames',
                energyCost: [
                    EnergyType.Fire,
                    EnergyType.Fire
                ],
                damage: 60,
                ordinalPosition: 1
            }
        ],
        energyType: EnergyType.Fire,
        maxHealth: 90,
        type: CardType.Pokemon,
        tier: 2
    },
    {
        imageId: '',
        name: 'Charizard',
        attacks: [
            {
                name: 'Roywal Blaze',
                energyCost: [
                    EnergyType.Fire,
                    EnergyType.Fire
                ],
                damage: 100,
                ordinalPosition: 0
            }
        ],
        energyType: EnergyType.Fire,
        maxHealth: 170,
        type: CardType.Pokemon,
        tier: 3
    }
];

const availablePokemon: ICard[] = lightningPokemon
    .concat(grassPokemon)
    .concat(fightingPokemon)
    .concat(metalPokemon)
    .concat(psychicPokemon)
    .concat(waterPokemon)
    .concat(darknessPokemon)
    .concat(firePokemon);

const pokemonByTypeMap: Map<EnergyType, ICard[]> = new Map([
    [EnergyType.Lightning, lightningPokemon],
    [EnergyType.Grass, grassPokemon],
    [EnergyType.Fighting, fightingPokemon],
    [EnergyType.Metal, metalPokemon],
    [EnergyType.Psychic, psychicPokemon],
    [EnergyType.Water, waterPokemon],
    [EnergyType.Darkness, darknessPokemon],
    [EnergyType.Fire, firePokemon],
    [EnergyType.Colorless, []]
])

const getPokemonByEnergyType = (type: EnergyType) => pokemonByTypeMap.get(type);

export {
    lightningPokemon,
    grassPokemon,
    fightingPokemon,
    metalPokemon,
    psychicPokemon,
    waterPokemon,
    darknessPokemon,
    firePokemon,
    getPokemonByEnergyType
}
export default availablePokemon;