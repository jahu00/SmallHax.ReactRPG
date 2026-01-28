import React from "react";
import { BattleActorOrientation } from "../types/battle-actor-orientation";
import { BattleActorState } from "../types/battle-actor-state";

export interface BattleActorProps {
    actor: BattleActorState;
    orientation: BattleActorOrientation;
    selected: boolean;
    onClick?(actor: BattleActorState): void;
}

export function BattleActor({actor, orientation, selected, onClick}: BattleActorProps) {
    const spriteKind: string = actor.hp === 0 ? "dead" : orientation;
    var handleClick = () => {
        onClick?.(actor);
    }
    return <div className={"battle-actor " + (selected ? "selected" : "")}>
            <div className="battle-actor-shadow"></div>
            <img className="battle-actor-sprite" src={`/content/battle-actors/${actor.name}/${actor.name}_${spriteKind}.png`}/>
            <div className="click-area" onClick={handleClick}></div>
        </div>;
}