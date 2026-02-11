import React from "react";
import { BattleActor } from "./battle-actor";
import { BattleTeam } from "types/battle/battle-team";
import { BattleActorOrientation } from "../types/battle-actor-orientation";
import { BattleActorStatusBar } from "./battle-actor-status-bar";
import { BattleActorState } from "../types/battle-actor-state";
import { BattleSlotState } from "../types/battle-slot-state";
import { RootState } from "store";
import { useSelector } from "react-redux";

export interface BattleSlotProps {
    slot: BattleSlotState;
    team: BattleTeam;
    selected: boolean;
    onClick?(actor: BattleActorState): void;
}

export function BattleSlot({slot, team, selected, onClick}: BattleSlotProps) {
    const orientation = team === BattleTeam.Enemy ? BattleActorOrientation.Front : BattleActorOrientation.Back;
    const actor = useSelector((state: RootState) => state.battle.actors.find(x => x.id === slot.actorId));
    const handleActorClick = () => {
        if (!actor){
            return;
        }
        onClick?.(actor);
    }
    const style = {
        "--battle-slot-size": slot.size ?? 1
    } as React.CSSProperties;
    return <div className="battle-slot" style={style}>
        {actor && actor?.hp > 0 && <BattleActorStatusBar actor={actor} team={team}/> }
        {actor && <BattleActor actor={actor} orientation={orientation} selected={selected} onClick={handleActorClick}/>}
    </div>
}