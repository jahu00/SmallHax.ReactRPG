import React from "react";
import { BattleActor } from "./battle-actor";
import { BattleTeam } from "../types/battle-team";
import { BattleActorOrientation } from "../types/battle-actor-orientation";
import { BattleActorStatusBar } from "./battle-actor-status-bar";
import { BattleActorState } from "../types/battle-actor-state";

export interface BattleSlotProps {
    actor: BattleActorState | null;
    team: BattleTeam;
    selected: boolean;
    onClick?(actor: BattleActorState): void;
}

export function BattleSlot({actor, team, selected, onClick}: BattleSlotProps) {
    const orientation = team === BattleTeam.Enemy ? BattleActorOrientation.Front : BattleActorOrientation.Back;
    const handleClick = () => {
        if (!actor){
            return;
        }
        onClick?.(actor);
    }
    return <div className="battle-slot" onClick={handleClick}>
        {actor && actor?.hp > 0 && <BattleActorStatusBar actor={actor} team={team}/> }
        {actor && <BattleActor actor={actor} orientation={orientation} selected={selected}/>}
    </div>
}