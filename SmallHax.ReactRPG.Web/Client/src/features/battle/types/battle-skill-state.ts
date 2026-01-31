import { BattleSkillData } from "types/battle/battle-skill-data";

export interface BattleSkillState extends BattleSkillData {
    id: number;
    cooldown: number;
}