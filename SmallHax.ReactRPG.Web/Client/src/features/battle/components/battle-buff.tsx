import React from "react";
import { BattleBuffState } from "../types/battle-buff-state";

export interface BattleBuffProps {
    buff: BattleBuffState;
}

export function BattleBuff({buff}: BattleBuffProps) {
    return <div className="battle-buff" style={{background: buff.background}}>
        <img className="battle-buff-icon" src={`/content/buffs/${buff.name}_buff.png`}/>
    </div>
}