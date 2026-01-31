import React from "react";
import { BattleTeam } from "../types/battle-team";
import { BattleSlot } from "./battle-slot";
import { BattleActorState } from "../types/battle-actor-state";

export interface BattleRowProps {
    actors: (BattleActorState)[];
    team: BattleTeam;
    selectedActorId: number | null;
    onSlotClick?(actor: BattleActorState): void;
}

export function BattleRow({actors, team, selectedActorId, onSlotClick}: BattleRowProps) {
    const handleSlotClick = (actor: BattleActorState) => {
        onSlotClick?.(actor);
    }
    return <div className={`battle-row ${team}`}>
        {actors.map(actor => <BattleSlot actor={actor} team={team} key={actor.id} selected={selectedActorId === actor.id} onClick={handleSlotClick}/>)}
    </div>;
}