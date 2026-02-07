import { BattleSkillData } from "./battle-skill-data"

export interface BattleActorData {
    name: string;
    skills: BattleSkillData[];
    baseStats: Record<string, number>;
}