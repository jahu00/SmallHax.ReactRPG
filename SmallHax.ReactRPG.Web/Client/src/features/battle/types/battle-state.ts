import { BattleActorState } from "./battle-actor-state";
import { BattlePhase } from "./battle-phase";

export interface BattleState {
    phase: BattlePhase;
    round: number;
    actors: BattleActorState[];
    turnOrder: number[];
    turn: number;
    currentActorId: number | null;
    selectedSkillId: number | null;
    background: string;
}