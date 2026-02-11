import React, { memo } from "react";
import { BattleTeam } from "types/battle/battle-team";
import { BattleSlot } from "./battle-slot";
import { BattleActorState } from "../types/battle-actor-state";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { BattleSlotState } from "../types/battle-slot-state";

export interface BattleRowProps {
    team: BattleTeam;
    battleSlots: Record<BattleTeam, BattleSlotState[]>;
    selectedActorId: number | null;
    onSlotClick?(actor: BattleActorState): void;
}

export const BattleRow = memo(function BattleRow({team, battleSlots, selectedActorId, onSlotClick}: BattleRowProps) {
    //const battleSlots = useSelector((state: RootState) => state.battle.battleSlots);
    const rowSlots = battleSlots[team];
    
    const handleSlotClick = (actor: BattleActorState) => {
        onSlotClick?.(actor);
    }
    return <div className={`battle-row ${team}`}>
        {rowSlots.map(slot => <BattleSlot slot={slot} team={team} key={slot.id} selected={selectedActorId === slot.actorId} onClick={handleSlotClick}/>)}
    </div>;
});