import { initBattle, toBattleActorStates } from "features/battle/battle-slice";
import { BattleTeam } from "types/battle/battle-team";
import { testAdventure } from "pages/test-adventure";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Battle } from "features/battle/battle";
import { BattlePhase } from "features/battle/types/battle-phase";
import { BattleActorState } from "features/battle/types/battle-actor-state";

export interface AdventureProps {

} 

export function Adventure() {
    const [stageId, setStageId] = useState(0);
    const [adventureData, setAdventureData] = useState(testAdventure);
    const dispatch = useDispatch();
    useEffect(() => {
        if (stageId > 0){
            return;
        }
        const playerParty = toBattleActorStates(adventureData.playerParty, BattleTeam.Player, 0);
        dispatch(initBattle({battleData: adventureData.stages[stageId], playerParty: playerParty}));
    }, [adventureData, stageId]);

    const handleBattleLost = useCallback(() => {
        // TODO: Handle battle lost
        return;
    }, []);


    const handleBattleWon = useCallback((playerParty: BattleActorState[]) => {
        const newStageId = stageId + 1;
        setStageId(newStageId);
        if (newStageId < adventureData.stages.length)
        {
            dispatch(initBattle({battleData: adventureData.stages[newStageId], playerParty: playerParty}));
        } else {
            // TODO: Handle adventure won
        }
    }, [stageId, adventureData])
    return <div><Battle onBattleLost={handleBattleLost} onBattleWon={handleBattleWon}/></div>;
}