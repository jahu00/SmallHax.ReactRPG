import React from "react";
import { BattleActorOrientation } from "../types/battle-actor-orientation";
import { BattleActorState } from "../types/battle-actor-state";

export interface BattleActorProps {
    actor: BattleActorState;
    orientation: BattleActorOrientation;
    selected: boolean;
}

export function BattleActor({actor, orientation, selected}: BattleActorProps) {
    const spriteKind: string = actor.hp === 0 ? "dead" : orientation;
    return <div className={"battle-actor " + (selected ? "selected" : "")}>
            <div className="battle-actor-shadow"></div>
            <img className="battle-actor-sprite" src={`/content/battle-actors/${actor.name}/${actor.name}_${spriteKind}.png`}/>
        </div>;
}