import React from "react";
import { BattleActorOrientation } from "../types/battle-actor-orientation";
import { BattleActorState } from "../types/battle-actor-state";
import { DefaultSpriteData } from "types/sprite-set";
import { useGetBattleActorSpriteSetQuery } from "features/sprite/sprite-api";
import { BattleActorSprite } from "features/sprite/components/battle-actor-sprite";
import { isDead } from "../battle-slice";

export interface BattleActorProps {
    actor: BattleActorState;
    orientation: BattleActorOrientation;
    selected: boolean;
    onClick?(actor: BattleActorState): void;
}

function getAnimation(animationName: string | undefined, orientation: BattleActorOrientation): string | undefined {
    switch(animationName){
        case "attacking":
            return orientation === BattleActorOrientation.Front ? "moveDown" : "moveUp";
        case "hurting":
            return orientation === BattleActorOrientation.Back ? "moveDown" : "moveUp";
    }
    return animationName;
}

export function BattleActor({actor, orientation, selected, onClick}: BattleActorProps) {
    const spriteSetQuery = useGetBattleActorSpriteSetQuery(actor.name);
    if (spriteSetQuery.isLoading){
        return <></>;
    }
    let pose: string;
    let style: React.CSSProperties = {};
    if (isDead(actor)) {
        pose = "dead"
    } else {
        pose = orientation;
        const animation = getAnimation(actor.animationName, orientation);
        if (animation) {
            style["animation"] = animation + " 0s forwards";
        }
    }
    const handleClick = () => {
        onClick?.(actor);
    }
    return <div className={"battle-actor " + actor.animationName} style={style}>
            <BattleActorSprite actorName={actor.name} pose={pose} selected={selected}/>
            <div className="click-area" onClick={handleClick}></div>
        </div>;
}