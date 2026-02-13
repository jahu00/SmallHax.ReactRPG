import { BattleData } from "types/battle/battle-data";
import { BattleActorState } from "./battle-actor-state";

export interface InitBattlePayload {
    battleData: BattleData;
    playerParty: BattleActorState[];
}