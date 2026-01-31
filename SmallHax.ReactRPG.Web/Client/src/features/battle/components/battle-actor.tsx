import React from "react";
import { BattleActorOrientation } from "../types/battle-actor-orientation";
import { BattleActorState } from "../types/battle-actor-state";
import { DefaultSpriteData } from "types/sprite-set";
import { useGetBattleActorSpriteSetQuery } from "features/sprite/sprite-api";
import { BattleActorSprite } from "features/sprite/components/battle-actor-sprite";

const _defaultSpriteData: DefaultSpriteData = {
    name: "default",
    anchor: {
        x: 0.5,
        y: 0.95
    },
    scale: 1,
    fileName: "/content/battle-actors/default.png"
};

export interface BattleActorProps {
    actor: BattleActorState;
    orientation: BattleActorOrientation;
    selected: boolean;
    onClick?(actor: BattleActorState): void;
}

export function BattleActor({actor, orientation, selected, onClick}: BattleActorProps) {
    const spriteSetQuery = useGetBattleActorSpriteSetQuery(actor.name);
    if (spriteSetQuery.isLoading){
        return <></>;
    }
    const pose: string = actor.hp === 0 ? "dead" : orientation;
    const handleClick = () => {
        onClick?.(actor);
    }
    return <div className={"battle-actor"}>
            <BattleActorSprite actorName={actor.name} pose={pose} selected={selected}/>
            <div className="click-area" onClick={handleClick}></div>
        </div>;
}