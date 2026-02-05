import { BattleActorData } from "types/battle/battle-actor-data";
import { BattleSkillState } from "./battle-skill-state";
import { BattleTeam } from "types/battle/battle-team";

export interface BattleActorState extends BattleActorData {
    id: number;
    slotId: number;
    hp: number;
    team: BattleTeam;
    skills: BattleSkillState[];
}