enum BattlePhaseEventType {
    CoinFlip = 'CoinFlip',
    ActivePokemonAttack = 'ActivePokemonAttack',
    ActivePokemonKnockedOut = 'ActivePokemonKnockedOut',
    PlayerAttack = 'PlayerAttack',
    PlayerKnockedOut = 'PlayerKnockedOut',
    Draw = 'Draw'
}

enum CardType {
    Pokemon = 'Pokemon',
    Energy = 'Energy'
}

enum EnergyType {
    Grass = 'Grass',
    Fire = 'Fire',
    Water = 'Water',
    Lightning = 'Lightning',
    Psychic = 'Psychic',
    Fighting = 'Fighting',
    Darkness = 'Darkness',
    Metal = 'Metal',

    // We won't have a colorless energy card, but the type must exist for cards that have it
    Colorless = 'Colorless'
}

enum Phase {
    RecruitPhase = 'RecruitPhase',
    BattlePhase = 'BattlePhase'
}

export {
    BattlePhaseEventType,
    CardType,
    EnergyType,
    Phase
}