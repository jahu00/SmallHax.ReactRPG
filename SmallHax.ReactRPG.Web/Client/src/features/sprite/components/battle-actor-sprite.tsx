import React from "react";
import { useGetBattleActorSpriteSetQuery } from "../sprite-api";
import { Point } from "types/point";
import { BattleActorShadow } from "./battle-actor-shadow";
import { SpriteData } from "types/sprite-set";

const _defaultSpriteData: SpriteData = {
    name: "default",
    x: 0.5,
    y: 0.95,
    scale: 1,
    shadowScale: 1,
    shadowMass: 0.2,
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
    const x = spriteData?.x ?? defaultSpriteData.x ?? (_defaultSpriteData.x as number);
    const y = spriteData?.y ?? defaultSpriteData.y ?? (_defaultSpriteData.y as number);
    const shadowScale = spriteData?.shadowScale ?? defaultSpriteData.shadowScale ?? (_defaultSpriteData.shadowScale as number);
    const shadowMass = spriteData?.shadowMass ?? defaultSpriteData.shadowMass ?? (_defaultSpriteData.shadowMass as number);
    const scale = spriteData?.scale ?? defaultSpriteData.scale ?? (_defaultSpriteData.scale as number);
    const style = {
        "--battle-actor-sprite-scale": (scale * 100) + "%",
        "--battle-actor-sprite-offset-x": (-100 * x).toFixed(2) + "%",
        "--battle-actor-sprite-offset-y": (100 - y * 100).toFixed(2) + "%",
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
            <BattleActorShadow scale={shadowScale} mass={shadowMass} />
            {selected && <div className="battle-actor-selection-indicator"></div>}
            <img className="battle-actor-sprite" src={spriteFileName} style={style}/>
        </>;
}