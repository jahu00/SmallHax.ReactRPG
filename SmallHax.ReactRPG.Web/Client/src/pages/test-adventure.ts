import { AdventureData } from "types/adventure/adventure-data";
import { getTestActor } from "./test-battle";

export const testAdventure: AdventureData = {
    playerParty: [getTestActor("knight"), getTestActor("elf"), getTestActor("vampire")],
    stages: [
        {
            background: "forest_2",
            enemies: [getTestActor("slime")]
        },
        {
            background: "forest_2",
            enemies: [getTestActor("slime"), getTestActor("slime")]
        },
        {
            background: "forest_2",
            enemies: [getTestActor("slime"), getTestActor("goblin"), getTestActor("slime")]
        },
    ]
};