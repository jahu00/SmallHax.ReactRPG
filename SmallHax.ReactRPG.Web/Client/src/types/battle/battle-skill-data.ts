import { BattleSkillActionType } from "./battle-skill-action-type";
import { BattleSkillTargetType } from "./battle-skill-target-type";

export interface BattleSkillData {
    name: string;
    maxCooldown: number;
    targetType: BattleSkillTargetType;
    actionType: BattleSkillActionType;
}