import { BattleSkillData } from "./battle-skill-data";

export interface BattleSkillState extends BattleSkillData {
    id: number;
    cooldown: number;
}