import React from "react";

export interface BattleActorShadowProps {
    scale: number;
}

export function BattleActorShadow({scale}: BattleActorShadowProps) {
    const style = {
            "--battle-actor-shadow-scale": (scale * 100) + "%"
        } as React.CSSProperties;
    return <div className="battle-actor-shadow" style={style}></div>;
}