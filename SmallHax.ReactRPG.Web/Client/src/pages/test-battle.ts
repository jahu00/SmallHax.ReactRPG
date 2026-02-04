import { BattleActorData } from "types/battle/battle-actor-data";
import { BattleData } from "types/battle/battle-data";
import { BattleSkillActionType } from "types/battle/battle-skill-action-type";
import { BattleSkillData, BattleSkillEffect, BattleSkillEffectCondition, BattleSkillEffectStatSource, BattleSkillEffectType, BattleSkillEffetTarget } from "types/battle/battle-skill-data";
import { BattleSkillTargetType } from "types/battle/battle-skill-target-type";

    const attackEffect: BattleSkillEffect = {
                condition: BattleSkillEffectCondition.Alive,
                type: BattleSkillEffectType.Damage,
                target: BattleSkillEffetTarget.SelectedTarget,
                power: 1,
                positiveStat: "attack",
                negativeStat: "defense"
            };

    const attackSkill: BattleSkillData = {
                name: "Attack",
                maxCooldown: 1,
                targetType: BattleSkillTargetType.Opponent,
                actionType: BattleSkillActionType.Attack,
                steps: [
                    {
                        effects: [{...attackEffect}]
                    }
                ]
            };

    const healEffect: BattleSkillEffect = {
                condition: BattleSkillEffectCondition.Alive,
                type: BattleSkillEffectType.Heal,
                target: BattleSkillEffetTarget.SelectedTarget,
                power: 1,
                positiveStat: "attack"
            };

    const healSkill: BattleSkillData = {
                name: "leaf",
                maxCooldown: 2,
                targetType: BattleSkillTargetType.Ally,
                actionType: BattleSkillActionType.Heal,
                steps: [
                    {
                        effects: [{...healEffect}]
                    }
                ]
            };

    const aoeEffect: BattleSkillEffect = {
                condition: BattleSkillEffectCondition.Alive,
                type: BattleSkillEffectType.Damage,
                target: BattleSkillEffetTarget.AllOpponents,
                power: 1,
                range: 1,
                positiveStat: "attack",
                negativeStat: "defense"
            };

    const aoeSkill: BattleSkillData = {
                name: "beam",
                maxCooldown: 3,
                actionType: BattleSkillActionType.Attack,
                targetType: BattleSkillTargetType.Opponent,
                steps: [
                    {
                        effects: [{...aoeEffect}]
                    }
                ]
            };

    const buffEffect: BattleSkillEffect = {
                condition: BattleSkillEffectCondition.Alive,
                type: BattleSkillEffectType.Buff,
                target: BattleSkillEffetTarget.SelectedTarget,
                applyBuffs: [
                    {
                        name: "shield",
                        duration: 2
                    }
                ]
            };

    const buffSkill: BattleSkillData = {
                name: "shield",
                maxCooldown: 2,
                actionType: BattleSkillActionType.Attack,
                targetType: BattleSkillTargetType.Ally,
                steps: [
                    {
                        effects: [{...buffEffect}]
                    }
                ]
            };

    const drainEffect: BattleSkillEffect = {
                condition: BattleSkillEffectCondition.Alive,
                type: BattleSkillEffectType.Damage,
                target: BattleSkillEffetTarget.SelectedTarget,
                power: 1,
                drainPower: 0.5,
                positiveStat: "attack",
                negativeStat: "defense"
            };

    const drainSkill: BattleSkillData = {
                name: "bloody_fangs",
                maxCooldown: 1,
                actionType: BattleSkillActionType.Attack,
                targetType: BattleSkillTargetType.Opponent,
                steps: [
                    {
                        effects: [{...drainEffect}]
                    }
                ]
            };

    const healSacraficeEffect: BattleSkillEffect = {
                condition: BattleSkillEffectCondition.Dead,
                type: BattleSkillEffectType.Heal,
                target: BattleSkillEffetTarget.SelectedTarget,
                power: 0.1,
                positiveStat: "maxHp",
                positiveStatSource: BattleSkillEffectStatSource.Target
            };

    const selfSacraficeEffect: BattleSkillEffect = {
                condition: BattleSkillEffectCondition.Alive,
                type: BattleSkillEffectType.Damage,
                target: BattleSkillEffetTarget.Self,
                power: 0.25,
                positiveStat: "maxHp",
                positiveStatSource: BattleSkillEffectStatSource.Caster,
                cannotKill: true
            };

    const selfSacraficeSkill: BattleSkillData = {
                name: "transfusion",
                maxCooldown: 3,
                actionType: BattleSkillActionType.Heal,
                targetType: BattleSkillTargetType.Ally,
                steps: [
                    {
                        effects: [{...selfSacraficeEffect}]
                    },
                    {
                        effects: [{...healSacraficeEffect}]
                    }
                ]
            };

    const goblin: BattleActorData = {
        name: "goblin",
        skills: [{...attackSkill}],
        maxHp: 10,
        attack: 3,
        defense: 1,
        speed: 3
    };
    const elf: BattleActorData = {
        name: "elf",
        skills: [
            {...attackSkill, name: "arrow"},
            {...healSkill, name: "leaf"}
        ],
        maxHp: 10,
        attack: 5,
        defense: 1,
        speed: 5
    }
    const knight: BattleActorData = {
        name: "knight",
        skills: [
            {...attackSkill, name: "sword"},
            {...buffSkill, name: "shield"},
            {...aoeSkill, name: "beam"},
        ],
        maxHp: 10,
        attack: 2,
        defense: 2,
        speed: 1
    }
    const vampire: BattleActorData = {
        name: "vampire",
        skills: [
            {...drainSkill, name: "bloody_fangs"},
            {...selfSacraficeSkill, name: "transfusion"}
        ],
        maxHp: 7,
        attack: 2,
        defense: 1,
        speed: 2
    }
    export const testBattle: BattleData = {
        background: "forest_2",
        enemyTeam: [{...goblin}, {...goblin}, {...goblin}, {...goblin}, {...goblin}],
        playerTeam: [knight, elf, vampire]
    }