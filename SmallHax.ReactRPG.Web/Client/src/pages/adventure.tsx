import React, { useEffect } from "react";
import { Battle } from "features/battle/components/battle";
import { BattleData } from "types/battle/battle-data";
import { BattleActorData } from "types/battle/battle-actor-data";
import { useDispatch } from "react-redux";
import { initBattle } from "features/battle/battle-slice";
import { BattleSkillTargetType } from "types/battle/battle-skill-target-type";
import { BattleSkillActionType } from "types/battle/battle-skill-action-type";

export function Adventure() {
    const goblin: BattleActorData = {
        name: "goblin",
        skills: [
            {
                name: "Attack",
                maxCooldown: 1,
                targetType: BattleSkillTargetType.Opponent,
                actionType: BattleSkillActionType.Attack
            }
        ],
        maxHp: 10,
        attack: 3,
        defense: 1,
        speed: 3
    };
    const elf: BattleActorData = {
        name: "elf",
        skills: [
            {
                name: "arrow",
                maxCooldown: 1,
                targetType: BattleSkillTargetType.Opponent,
                actionType: BattleSkillActionType.Attack
            },
            {
                name: "leaf",
                maxCooldown: 2,
                targetType: BattleSkillTargetType.Ally,
                actionType: BattleSkillActionType.Heal
            }
        ],
        maxHp: 10,
        attack: 5,
        defense: 1,
        speed: 5
    }
    const knight: BattleActorData = {
        name: "knight",
        skills: [
            {
                name: "sword",
                maxCooldown: 1,
                actionType: BattleSkillActionType.Attack,
                targetType: BattleSkillTargetType.Opponent
            },
            {
                name: "shield",
                maxCooldown: 2,
                actionType: BattleSkillActionType.Attack,
                targetType: BattleSkillTargetType.Opponent
            }
            ,
            {
                name: "beam",
                maxCooldown: 3,
                actionType: BattleSkillActionType.Attack,
                targetType: BattleSkillTargetType.Opponent
            }
        ],
        maxHp: 10,
        attack: 2,
        defense: 2,
        speed: 1
    }
    const battle: BattleData = {
        background: "forest_2",
        enemyTeam: [{...goblin}, {...goblin}, {...goblin}],
        playerTeam: [knight, elf]
    }
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(initBattle(battle));
    }, [])
    return <div><Battle/></div>;
}