import React, { useEffect } from "react";
import "assets/battle.css"
import { BattleSkill } from "./battle-skill";
import { BattleData } from "types/battle/battle-data";
import { BattleTeam } from "types/battle/battle-team";
import { BattleRow } from "./battle-row";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { BattleActorState } from "../types/battle-actor-state";
import { BattlePhase } from "../types/battle-phase";
import { getEnemySkillUse, isAlive, isDead, processActorSkill, processTurn, progressRound, selectSkill, setActorAnimation } from "../battle-slice";
import { BattleSkillState } from "../types/battle-skill-state";
import { BattleSkillTargetType } from "types/battle/battle-skill-target-type";
import { BattleSkillCondition } from "types/battle/battle-skill-data";
import { BattleState } from "../types/battle-state";

export interface BattleProps {
    onBattleOver?: (phase: BattlePhase, playerParty: BattleActorState[]) => void;
}

export function Battle({onBattleOver}: BattleProps){
    const dispatch = useDispatch();
    const phase = useSelector((state: RootState) => state.battle.phase);
    const actors = useSelector((state: RootState) => state.battle.actors);
    const turn = useSelector((state: RootState) => state.battle.turn);
    const turnOrder = useSelector((state: RootState) => state.battle.turnOrder);
    const background = useSelector((state: RootState) => state.battle.background);
    const currentActorId = useSelector((state: RootState) => state.battle.currentActorId);
    const selectedSkillId = useSelector((state: RootState) => state.battle.selectedSkillId);
    const enemyTeam = actors.filter(x => x.team === BattleTeam.Enemy);
    const playerTeam = actors.filter(x => x.team === BattleTeam.Player);
    const currentActor = actors.length && currentActorId !== null ? actors[currentActorId]: null;
    const selectedSkill = selectedSkillId !== null && currentActor != null ? currentActor.skills[selectedSkillId] : null;

    useEffect(() => {
        if (phase !== BattlePhase.NextRound){
            return;
        }
        dispatch(progressRound());
    }, [phase, progressRound]);

    useEffect(() => {
        if (phase !== BattlePhase.NextTurn){
            return;
        }
        dispatch(processTurn());
    }, [phase, processTurn]);

    useEffect(() => {
        if (phase !== BattlePhase.ActorUsesSkill){
            return;
        }
        const id = setTimeout(() => { dispatch(processTurn()); }, 500);
        return () => clearTimeout(id);
    }, [phase, processTurn]);

    useEffect(() => {
        if (phase !== BattlePhase.Won && phase !== BattlePhase.Lost){
            return;
        }
        const id = setTimeout(() => { onBattleOver?.(phase, playerTeam); }, 500);
        return () => clearTimeout(id);
    }, [phase, playerTeam, onBattleOver]);

    useEffect(() => {
        if (phase !== BattlePhase.EnemyTurn){
            return;
        }
        if (currentActorId === null){
            throw Error("CurrentActorId is null");
        }
        const skillUse = getEnemySkillUse(actors, currentActorId);
        dispatch(setActorAnimation({ actorId: currentActorId, animationName: "attacking" }));
        const id = setTimeout(() => { dispatch(processActorSkill(skillUse)); }, 500);
        return () => clearTimeout(id);
    }, [phase, progressRound]);

    const handleSkillClick = (skill: BattleSkillState) => {
        if (selectedSkillId == skill.id) {
            dispatch(selectSkill(null));
            return;
        }
        dispatch(selectSkill(skill.id));
    }

    const handleActorClick = (actor: BattleActorState) => {
        if (phase !== BattlePhase.PlayerTurn){
            return;
        }
        if (currentActorId === null || selectedSkill === null)
        {
            return;
        }
        if (
            actor.id != currentActorId &&
            [BattleSkillTargetType.Self].indexOf(selectedSkill.targetType) > -1
        ) {
            return;
        }
        if (
            actor.team === BattleTeam.Player &&
            [BattleSkillTargetType.Opponent, BattleSkillTargetType.AllOpponent].indexOf(selectedSkill.targetType) > -1
        ) {
            return;
        }
        if (
            actor.team === BattleTeam.Enemy &&
            [BattleSkillTargetType.Ally, BattleSkillTargetType.AllAllies].indexOf(selectedSkill.targetType) > -1
        ) {
            return;
        }
        const targetCondition = selectedSkill.targetCondition ?? BattleSkillCondition.Alive;
        if (targetCondition === BattleSkillCondition.Alive && isDead(actor)){
            return;
        }
        if (targetCondition === BattleSkillCondition.Dead && isAlive(actor)){
            return;
        }
        dispatch(setActorAnimation({ actorId: currentActorId, animationName: "attacking" }));
        const id = setTimeout(() => { dispatch(processActorSkill({ casterId: currentActorId, skillId: selectedSkill.id, targetId: actor.id })); }, 500);
        return () => clearTimeout(id);
    }

    return <div className="battle" style={{backgroundImage: `url(/content/backgrounds/${background}.png)`}}>
        <BattleRow actors={enemyTeam} team={BattleTeam.Enemy} selectedActorId={currentActorId} onSlotClick={handleActorClick}/>
        <BattleRow actors={playerTeam} team={BattleTeam.Player} selectedActorId={currentActorId} onSlotClick={handleActorClick}/>
        <div className="battle-skills">
            {phase == BattlePhase.PlayerTurn && currentActor?.skills.map(skill => <BattleSkill skill={skill} key={skill.id} onClick={handleSkillClick} selected={skill.id === selectedSkillId}/>)}
        </div>
    </div>;
}

