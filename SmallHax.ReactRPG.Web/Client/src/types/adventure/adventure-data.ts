import { BattleActorData } from "types/battle/battle-actor-data";
import { BattleData } from "types/battle/battle-data";

export interface AdventureData {
    playerParty: BattleActorData[];
    stages: BattleData[];
}