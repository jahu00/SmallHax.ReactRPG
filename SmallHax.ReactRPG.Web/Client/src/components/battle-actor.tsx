import React from "react";
import { BattleActorOrientation } from "../types/battle-actor-orientation";
import { BattleActorState } from "../types/battle-actor-state";
import { DefaultSpriteData } from "../types/sprite-set";
import { useGetBattleActorSpriteSetQuery } from "../store/sprite-api";
import { Point } from "../types/point";

const _defaultSpriteData: DefaultSpriteData = {
    name: "default",
    anchor: {
        x: 50,
        y: 0
    },
    scale: 100,
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
    const spriteKind: string = actor.hp === 0 ? "dead" : orientation;
    const spriteData = spriteSetQuery.data?.variants.find(x => x.name == spriteKind);
    const defaultSpriteData = spriteSetQuery.data?.default ?? _defaultSpriteData;
    const anchor: Point = {
        x: spriteData?.anchor?.x ?? defaultSpriteData.anchor.x,
        y: spriteData?.anchor?.y ?? defaultSpriteData.anchor.y,
    };
    const scale = spriteData?.scale ?? defaultSpriteData.scale;
    const style = {
        "--battle-actor-sprite-scale": scale + "%",
        "--battle-actor-sprite-anchor-x": anchor.x + "%",
        "--battle-actor-sprite-anchor-y": anchor.y + "%",
    } as React.CSSProperties;
    let spriteFileName = spriteData?.fileName;
    if (spriteFileName)
    {
        spriteFileName = `/content/battle-actors/${actor.name}/${spriteFileName}`;
    }
    else if (spriteData || defaultSpriteData !== _defaultSpriteData){
        const spriteName = spriteData?.name ?? defaultSpriteData.name;
        spriteFileName = `/content/battle-actors/${actor.name}/${actor.name}_${spriteName}.png`;
    }
    else {
        spriteFileName = defaultSpriteData.fileName;
    }
    const handleClick = () => {
        onClick?.(actor);
    }
    return <div className={"battle-actor " + (selected ? "selected" : "")} style={style}>
            <div className="battle-actor-shadow"></div>
            <img className="battle-actor-sprite" src={spriteFileName}/>
            <div className="click-area" onClick={handleClick}></div>
        </div>;
}