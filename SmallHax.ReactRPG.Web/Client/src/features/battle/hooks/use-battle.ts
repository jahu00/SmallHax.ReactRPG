import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { BattlePhase } from "../types/battle-phase";
import { BattleActorState } from "../types/battle-actor-state";

export interface UseBattleOptions {
    onBattleWon?(): void;
    onBattleLost?(): void;
}

export function useBattle({onBattleWon, onBattleLost}: UseBattleOptions){
    //const dispatch = useDispatch();
    const phase = useSelector((state: RootState) => state.battle.phase);
    useEffect(
        () => {
            if (phase === BattlePhase.Won){
                onBattleWon?.();
                return;
            }
            if (phase === BattlePhase.Lost){
                onBattleLost?.();
                return;
            }
        },
        [phase, onBattleWon, onBattleLost]
    )
    return {phase};
}