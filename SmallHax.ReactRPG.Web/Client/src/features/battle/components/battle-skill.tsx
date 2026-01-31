import React from "react";
import { BattleSkillState } from "../types/battle-skill-state";

export interface BattleSkillProps {
    skill: BattleSkillState;
    onClick?(skill: BattleSkillState): void;
    selected: boolean;
}

export function BattleSkill({skill, onClick, selected}: BattleSkillProps) {
    const handleClick = () => {
        if (skill.cooldown > 0){
            return;
        }
        onClick?.(skill);
    }
    let additionalClasses = "";
    if (skill.cooldown > 0) {
        additionalClasses = "disabled";
    } else if (selected) {
        additionalClasses = "selected";
    }
    return <div className={"battle-skill " + additionalClasses} onClick={handleClick}>
            <div className="battle-skill-icon" style={{backgroundImage:`url(/content/skills/${skill.name}_skill.png)`}}></div>
            {skill.cooldown > 0 && <div className="battle-skill-cooldown">{skill.cooldown}</div>}
            <div className="battle-skill-frame"></div>
        </div>;
}