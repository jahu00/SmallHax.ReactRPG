import { BattleSkillData } from "types/battle/battle-skill-data";

export interface BattleSkillUse {
    skillId: number;
    casterId: number;
    targetId: number;
}