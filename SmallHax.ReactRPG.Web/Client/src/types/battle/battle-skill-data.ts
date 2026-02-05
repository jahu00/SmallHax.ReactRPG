import { BattleSkillActionType } from "./battle-skill-action-type";
import { BattleSkillTargetType } from "./battle-skill-target-type";

export interface BattleSkillData {
    name: string;
    maxCooldown: number;
    targetType: BattleSkillTargetType;
    actionType: BattleSkillActionType;
    targetCondition?: BattleSkillCondition;
    steps: BattleSkillStep[];
}

export interface BattleSkillStep {
    effects: BattleSkillEffect[];
}

export interface BattleSkillEffect {
    type: BattleSkillEffectType;
    target: BattleSkillEffetTarget;
    condition?: BattleSkillCondition;
    power?: number;
    drainPower?: number;
    range?: number;
    positiveStat?: string;
    positiveStatSource?: BattleSkillEffectStatSource;
    negativeStat?: string;
    negativeStatSource?: BattleSkillEffectStatSource;
    applyBuffs?: BattleSkillEffectBuff[];
    removeBuffs?: BattleSkillEffectBuff[];
    cannotKill?: boolean;
}

export interface BattleSkillEffectBuff {
    name: string;
    power?: number;
    duration?: number;
    //TODO: groups, stacks, etc.
}

export enum BattleSkillEffectStatSource {
    Caster,
    Target
}

export enum BattleSkillEffectType {
    Damage,
    Heal,
    Buff,
    RemoveBuff
}

export enum BattleSkillEffetTarget {
    Self,
    SelectedTarget,
    RandomOpponent,
    RandomOpponentOtherThanTarget,
    AllOpponents,
    AllOpponentsOtherThanTarget,
    RandomAlly,
    RandomAllyOtherThanTarget,
    RandomAllyOtherThanSelf,
    AllAllies,
    AllAlliesOtherThanTarget,
    AllAlliesOtherThanSelf,
    Everyone,
    EveryoneOtherThanTarget,
    EveryoneOtherThanSelf,
    Random
}

export enum BattleSkillCondition {
    Alive,
    Dead,
    DeadOrAlive
}