import { BattleTeam } from "types/battle/battle-team";
import { BattleActorState } from "./battle-actor-state";
import { BattlePhase } from "./battle-phase";
import { BattleSlotState } from "./battle-slot-state";

export interface BattleState {
    phase: BattlePhase;
    round: number;
    actors: BattleActorState[];
    turnOrder: number[];
    turn: number;
    currentActorId: number | null;
    selectedSkillId: number | null;
    background: string;
    battleSlots: Record<BattleTeam, BattleSlotState[]>;
}