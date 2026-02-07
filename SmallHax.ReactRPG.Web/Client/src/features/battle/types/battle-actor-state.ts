import { BattleActorData } from "types/battle/battle-actor-data";
import { BattleSkillState } from "./battle-skill-state";
import { BattleTeam } from "types/battle/battle-team";
import { BattleBuffState } from "./battle-buff-state";

export interface BattleActorState extends BattleActorData {
    id: number;
    slotId: number;
    hp: number;
    team: BattleTeam;
    skills: BattleSkillState[];
    animationName?: string;
    stats: Record<string, number>;
    buffs: BattleBuffState[];
}