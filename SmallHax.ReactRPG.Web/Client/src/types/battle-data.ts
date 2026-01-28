import { BattleActorData } from "./battle-actor-data";

export interface BattleData {
    playerTeam: BattleActorData[]
    enemyTeam: BattleActorData[]
    background: string
}