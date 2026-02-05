import React, { useEffect } from "react";
import { Battle } from "features/battle/components/battle";
import { useDispatch } from "react-redux";
import { initBattle } from "features/battle/battle-slice";
import { testBattle } from "./test-battle";

export function Adventure() {

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(initBattle(testBattle));
    }, [])
    return <div><Battle/></div>;
}