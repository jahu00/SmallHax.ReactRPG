import { BattleActorData } from "./battle-actor-data";
import { BattleSkillState } from "./battle-skill-state";
import { BattleTeam } from "./battle-team";

export interface BattleActorState extends BattleActorData {
    id: number
    hp: number
    team: BattleTeam
    skills: BattleSkillState[]
}