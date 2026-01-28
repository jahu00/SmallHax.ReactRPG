import React from "react";
import { ProgressBar } from "./common/progress-bar";
import { BattleTeam } from "../types/battle-team";
import { BattleActorState } from "../types/battle-actor-state";

export interface BattleActorStatusBarProps {
    actor: BattleActorState
    team: BattleTeam
}

export function BattleActorStatusBar({actor, team}: BattleActorStatusBarProps) {
    return <div className="battle-actor-status-bar">
        <ProgressBar className={`hp ${team}`} min={0} max={actor.maxHp} value={actor.hp || 0}/>
    </div>
}