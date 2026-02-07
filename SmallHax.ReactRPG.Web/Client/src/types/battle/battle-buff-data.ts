export interface BattleBuffData {
    name: string;
    background: string;
    effects: BattleBuffEffect[];
    maxDuration: number;
    group: string;
    power?: number;
    // TODO: Handle stacks and replacing weaker buff of the same type with stronger one
}

export interface BattleBuffEffect {
    type: BattleBuffEffectType;
    statName?: string;
    modifierType?: StatModifierType;
    power?: number;
}

export enum BattleBuffEffectType {
    ChangeStat = "change-stat",
}

export enum StatModifierType {
    Flat,
    Multiplication
}