import { BattleSkillData } from "./battle-skill-data";

export interface BattleSkillUse {
    skillId: number
    casterId: number
    targetIds: number[]
}