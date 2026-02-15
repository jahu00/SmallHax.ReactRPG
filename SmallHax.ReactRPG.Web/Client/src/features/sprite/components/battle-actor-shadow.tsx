import React from "react";

export interface BattleActorShadowProps {
    scale: number;
    mass: number;
}

export function BattleActorShadow({scale, mass}: BattleActorShadowProps) {
    const style = {
            "--battle-actor-shadow-scale": (scale * 100) + "%",
            "--battle-actor-shadow-mass": (mass * 100) + "%",
        } as React.CSSProperties;
    return <div className="battle-actor-shadow" style={style}></div>;
}