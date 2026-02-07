import React from "react";
import { ProgressBar } from "components/progress-bar";
import { BattleTeam } from "types/battle/battle-team";
import { BattleActorState } from "../types/battle-actor-state";
import { BattleBuff } from "./battle-buff";

export interface BattleActorStatusBarProps {
    actor: BattleActorState
    team: BattleTeam
}

export function BattleActorStatusBar({actor, team}: BattleActorStatusBarProps) {
    return <div className="battle-actor-status-bar">
        <ProgressBar className={`hp ${team}`} min={0} max={actor.stats.maxHp} value={actor.hp || 0}/>
        <div className="battle-buff-bar">
            {actor.buffs.map(x => <BattleBuff buff={x} key={x.group} />)}
        </div>
    </div>
}