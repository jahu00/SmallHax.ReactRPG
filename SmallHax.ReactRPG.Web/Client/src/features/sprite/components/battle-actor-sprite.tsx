import React from "react";
import { DefaultSpriteData } from "types/sprite-set";
import { useGetBattleActorSpriteSetQuery } from "../sprite-api";
import { Point } from "types/point";

const _defaultSpriteData: DefaultSpriteData = {
    name: "default",
    anchor: {
        x: 0.5,
        y: 0.95
    },
    scale: 1,
    fileName: "/content/battle-actors/default.png"
};

export interface BattleActorSpriteProps {
    actorName: string;
    pose: string;
    selected?: boolean;
}

export function BattleActorSprite({actorName, pose, selected}: BattleActorSpriteProps) {
    const spriteSetQuery = useGetBattleActorSpriteSetQuery(actorName);
    if (spriteSetQuery.isLoading){
        return <></>;
    }
    const spriteData = spriteSetQuery.data?.variants.find(x => x.name == pose);
    const defaultSpriteData = spriteSetQuery.data?.default ?? _defaultSpriteData;
    const anchor: Point = {
        x: spriteData?.anchor?.x ?? defaultSpriteData.anchor.x,
        y: spriteData?.anchor?.y ?? defaultSpriteData.anchor.y,
    };
    const scale = spriteData?.scale ?? defaultSpriteData.scale;
    const style = {
        "--battle-actor-sprite-scale": (scale * 100) + "%",
        "--battle-actor-sprite-offset-x": (-100 * anchor.x).toFixed(2) + "%",
        "--battle-actor-sprite-offset-y": (100 - anchor.y * 100).toFixed(2) + "%",
    } as React.CSSProperties;
    let spriteFileName = spriteData?.fileName;
    if (spriteFileName)
    {
        spriteFileName = `/content/battle-actors/${actorName}/${spriteFileName}`;
    }
    else if (spriteData || defaultSpriteData !== _defaultSpriteData){
        const spriteName = spriteData?.name ?? defaultSpriteData.name;
        spriteFileName = `/content/battle-actors/${actorName}/${actorName}_${spriteName}.png`;
    }
    else {
        spriteFileName = defaultSpriteData.fileName;
    }
    return <>
            <div className="battle-actor-shadow" style={style}></div>
            {selected && <div className="battle-actor-selection-indicator"></div>}
            <img className="battle-actor-sprite" src={spriteFileName} style={style}/>
        </>;
}