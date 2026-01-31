import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { BattlePhase } from '../types/battle-phase'
import { BattleData } from '../types/battle-data'
import { BattleActorState } from '../types/battle-actor-state'
import { BattleTeam } from '../types/battle-team'
import { BattleActorData } from '../types/battle-actor-data'
import { BattleSkillUse } from '../types/battle-skill-use'
import { BattleSkillData } from '../types/battle-skill-data'
import { BattleSkillState } from '../types/battle-skill-state'
import { BattleState } from '../types/battle-state'
import { BattleSkillActionType } from '../types/battle-skill-action-type'

/*export interface BattleState {
    phase: BattlePhase
    round: number
    actors: BattleActorState[]
    turnOrder: number[]
    turn: number
    background: string
}*/

const initialState: BattleState = {
  phase: BattlePhase.NoteSet,
  round: 0,
  actors: [],
  turnOrder: [],
  turn: 0,
  background: "none",
  currentActorId: null,
  selectedSkillId: null
}

export function toBattleSkillState(skill: BattleSkillData, index: number): BattleSkillState{
  return {...skill, cooldown: 0, id: index};
}

export function toBattleSkillStates(skills: BattleSkillData[]): BattleSkillState[]{
  return skills.map((x, i) => toBattleSkillState(x, i));
}

export function toBattleActorState(actor: BattleActorData, team: BattleTeam, index: number) : BattleActorState{
  return {...actor, hp: actor.maxHp, team: team, id: index, skills: toBattleSkillStates(actor.skills)};
}

export function toBattleActorStates(actors: BattleActorData[], team: BattleTeam, index: number): BattleActorState[]{
  return actors.map((x, i) => toBattleActorState(x, team, index + i));
}

export function getActorTurnOrder(actors: BattleActorState[]): number[] {
  const turnOrder = actors.map((x, i) => ({index: i, speed: x.speed}))
    .toSorted((a, b) => b.speed - a.speed)
    .map(x => x.index);
  return turnOrder;
}

export function hasTeamLost(actors: BattleActorState[], team: BattleTeam){
  return actors.filter(x => x.team === team).every(x => x.hp == 0);
}

export function getEnemySkillUse(actors: BattleActorState[], actorId: number): BattleSkillUse{
  const actor = actors.find(x => x.id === actorId);
  if (!actor) {
    throw Error(`Actor with id ${actorId} not found!`);
  }
  const oppositeTeam = actors.filter(x => x.team !== actor.team);
  const target = oppositeTeam.find(x => x.hp > 0);
  if (!target) {
    throw Error(`No living member of the opposing team found!`);
  }
  const skill = actor.skills.toSorted((a, b) => b.maxCooldown - a.maxCooldown).find(x => x.cooldown === 0);
  if (!skill) {
    throw Error(`No usable skill found!`);
  }
  return { casterId: actor.id, skillId: skill.id, targetIds: [ target.id ] };
}

export const battleSlice = createSlice({
  name: 'battle',
  initialState,
  reducers: {
    initBattle: (state, action: PayloadAction<BattleData>) => {
      state.phase = BattlePhase.NextRound;
      state.round = 0;
      state.turn = 0;
      state.currentActorId = null;
      state.selectedSkillId = null;
      let actors: BattleActorState[] = toBattleActorStates(action.payload.playerTeam, BattleTeam.Player, 0);
      actors = actors.concat(toBattleActorStates(action.payload.enemyTeam, BattleTeam.Enemy, actors.length));
      state.actors = actors;
      state.background = action.payload.background;
    },
    progressRound: (state) => {
      state.turnOrder = getActorTurnOrder(state.actors);
      state.turn = -1;
      state.round += 1;
      state.phase = BattlePhase.NextTurn;
    },
    processTurn: (state) => {
      if (hasTeamLost(state.actors, BattleTeam.Enemy)){
        state.phase = BattlePhase.Won;
        return;
      }
      if (hasTeamLost(state.actors, BattleTeam.Player)){
        state.phase = BattlePhase.Lost;
        return;
      }
      let actor : BattleActorState;
      do
      {
        state.turn += 1;
        if (state.turn === state.actors.length)
        {
          state.phase = BattlePhase.NextRound;
          return;
        }
        actor = state.actors[state.turnOrder[state.turn]];
      } while(actor.hp == 0)

      for(let skill of actor.skills) {
        if (skill.cooldown > 0){
          skill.cooldown -= 1;
        }
      }

      state.selectedSkillId = null;
      state.currentActorId = actor.id;

      if (actor.team == BattleTeam.Player){
        state.phase = BattlePhase.PlayerTurn;
        return;
      }
      if (actor.team == BattleTeam.Enemy){
        state.phase = BattlePhase.EnemyTurn;
        return;
      }

      throw new Error(`Unknown BattleTeam = ${actor.team}`);
    },
    selectSkill: (state, action: PayloadAction<number | null>) => {
      state.selectedSkillId = action.payload;
    },
    processActorSkill: (state, action: PayloadAction<BattleSkillUse>) => {
      const caster = state.actors[action.payload.casterId];
      const skill = caster.skills[action.payload.skillId];
      for(let targetId of action.payload.targetIds){
        const target = state.actors[targetId]
        let attack = caster.attack - target.defense;
        if (attack < 0){
          attack = 0;
        }
        let newHp = target.hp;
        if (skill.actionType === BattleSkillActionType.Attack)
        {
          newHp -= attack;
        }
        else if(skill.actionType === BattleSkillActionType.Heal)
        {
          newHp += attack;
        }
        if (newHp < 0){
          newHp = 0
        }
        else if (newHp > target.maxHp){
          newHp = target.maxHp;
        }
        target.hp = newHp;
      }

      skill.cooldown = skill.maxCooldown;
      state.phase = BattlePhase.NextTurn;
    }
  },
})

// Action creators are generated for each case reducer function
export const { initBattle, progressRound, processTurn, selectSkill, processActorSkill } = battleSlice.actions

export default battleSlice.reducer