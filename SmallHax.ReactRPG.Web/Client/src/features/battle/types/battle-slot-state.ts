import { BattleSlotData } from "types/battle/battle-slot-data";

export interface BattleSlotState extends BattleSlotData {
    id: number;
    actorId?: number;
}