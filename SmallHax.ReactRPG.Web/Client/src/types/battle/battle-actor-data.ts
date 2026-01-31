import { BattleSkillData } from "./battle-skill-data"

export interface BattleActorData {
    name: string
    skills: BattleSkillData[]
    maxHp: number
    attack: number
    defense: number
    speed: number
}