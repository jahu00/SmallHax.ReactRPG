import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { BattlePhase } from './types/battle-phase'
import { BattleData } from 'types/battle/battle-data'
import { BattleActorState } from './types/battle-actor-state'
import { BattleTeam } from 'types/battle/battle-team'
import { BattleActorData } from 'types/battle/battle-actor-data'
import { BattleSkillUse } from './types/battle-skill-use'
import { BattleSkillData, BattleSkillEffect, BattleSkillCondition, BattleSkillEffectStatSource, BattleSkillEffectType, BattleSkillEffetTarget } from 'types/battle/battle-skill-data'
import { BattleSkillState } from './types/battle-skill-state'
import { BattleState } from './types/battle-state'
import { BattleSkillActionType } from 'types/battle/battle-skill-action-type'
import { getRandomItem } from 'utils/math'

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

export function toBattleSkillState(skill: BattleSkillData, id: number): BattleSkillState{
  return {...skill, cooldown: 0, id: id};
}

export function toBattleSkillStates(skills: BattleSkillData[]): BattleSkillState[]{
  return skills.map((x, i) => toBattleSkillState(x, i));
}

export function toBattleActorState(actor: BattleActorData, team: BattleTeam, id: number, slotId: number) : BattleActorState{
  return {...actor, hp: actor.maxHp, team: team, id: id, slotId: slotId, skills: toBattleSkillStates(actor.skills)};
}

export function toBattleActorStates(actors: BattleActorData[], team: BattleTeam, index: number): BattleActorState[]{
  return actors.map((x, i) => toBattleActorState(x, team, index + i, i));
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
  const availableTargets = oppositeTeam.filter(x => isAlive(x));
  if (!availableTargets.length) {
    throw Error(`No living member of the opposing team found!`);
  }
  //const target = oppositeTeam.find(x => x.hp > 0);
  // TODO: Use Min Max to select skill and target (also take into account if it's support skill or actor is taunted)
  const target = getRandomItem(availableTargets);
  const skill = actor.skills.toSorted((a, b) => b.maxCooldown - a.maxCooldown).find(x => x.cooldown === 0);
  if (!skill) {
    throw Error(`No usable skill found!`);
  }
  return { casterId: actor.id, skillId: skill.id, targetId: target.id };
}

export function isAlive(actor: BattleActorState): boolean {
  return actor.hp > 0;
}

export function isDead(actor: BattleActorState): boolean {
  return actor.hp === 0;
}

export function getTargetsForSkillEffect(skillEffect: BattleSkillEffect, actors: BattleActorState[], caster: BattleActorState, mainTarget: BattleActorState): BattleActorState[] {
  let targets: BattleActorState[] = [];
  for (let actor of actors) {
    let condition = skillEffect.condition;
    if (!condition) {
      condition = BattleSkillCondition.Alive;
    }
    if (condition == BattleSkillCondition.Alive && !isAlive(actor)){
      continue;
    }
    if (condition == BattleSkillCondition.Dead && !isDead(actor)){
      continue;
    }
    if (skillEffect.target === BattleSkillEffetTarget.Self && actor.id != caster.id){
      continue;
    }
    if ([
          BattleSkillEffetTarget.EveryoneOtherThanSelf,
          BattleSkillEffetTarget.AllAlliesOtherThanSelf,
          BattleSkillEffetTarget.RandomAllyOtherThanSelf,
    ].some(x => x === skillEffect.target) && caster.id === actor.id) {
      continue;
    }
    if (skillEffect.target === BattleSkillEffetTarget.SelectedTarget && actor.id != mainTarget.id){
      continue;
    }
    if ([
          BattleSkillEffetTarget.EveryoneOtherThanTarget,
          BattleSkillEffetTarget.AllAlliesOtherThanTarget,
          BattleSkillEffetTarget.RandomAllyOtherThanTarget,
          BattleSkillEffetTarget.AllOpponentsOtherThanTarget,
          BattleSkillEffetTarget.RandomOpponentOtherThanTarget,
    ].some(x => x === skillEffect.target) && mainTarget.id === actor.id) {
      continue;
    }
    if ([
          BattleSkillEffetTarget.AllAllies,
          BattleSkillEffetTarget.AllAlliesOtherThanSelf,
          BattleSkillEffetTarget.AllAlliesOtherThanTarget,
          BattleSkillEffetTarget.RandomAlly,
          BattleSkillEffetTarget.RandomAllyOtherThanSelf,
          BattleSkillEffetTarget.RandomAllyOtherThanTarget,
    ].some(x => x === skillEffect.target) && caster.team !== actor.team) {
      continue;
    }
    if ([
          BattleSkillEffetTarget.AllOpponents,
          BattleSkillEffetTarget.AllOpponentsOtherThanTarget,
          BattleSkillEffetTarget.RandomOpponent,
          BattleSkillEffetTarget.RandomOpponentOtherThanTarget,
    ].some(x => x === skillEffect.target) && caster.team === actor.team) {
      continue;
    }
    if (
        skillEffect.range !== undefined
        && (
          actor.team !== mainTarget.team
          || Math.abs(mainTarget.slotId - actor.slotId) > skillEffect.range
        )
    ) {
      continue;
    }
    targets.push(actor);
  }

  if ([
          BattleSkillEffetTarget.RandomAlly,
          BattleSkillEffetTarget.RandomAllyOtherThanSelf,
          BattleSkillEffetTarget.RandomAllyOtherThanTarget,
          BattleSkillEffetTarget.RandomOpponent,
          BattleSkillEffetTarget.RandomOpponentOtherThanTarget,
          BattleSkillEffetTarget.Random,
    ].some(x => x === skillEffect.target) && targets.length > 0) {
      const target = getRandomItem(targets);
      targets = [target];
    }
    return targets;
}

export function getStat(actor: BattleActorState, statName: string): number {
  const stats = actor as unknown as Record<string,number>;
  const stat = stats[statName];
  return stat;
}

export function getStatSource(statSource: BattleSkillEffectStatSource | undefined, caster: BattleActorState, target: BattleActorState): BattleActorState | undefined{
  if (statSource === BattleSkillEffectStatSource.Caster){
    return caster;
  }
  if (statSource === BattleSkillEffectStatSource.Target) {
    return target;
  }
  return undefined;
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
      const mainTarget = state.actors[action.payload.targetId];
      for(let skillStep of skill.steps) {
        for (let skillEffect of skillStep.effects){
          let targets = getTargetsForSkillEffect(skillEffect, state.actors, caster, mainTarget);
          for (let target of targets){
            let positiveStatValue = skillEffect.power ?? 0;
            let positiveStatSource = getStatSource(skillEffect.positiveStatSource, caster, target) ?? caster;

            if (positiveStatSource && skillEffect.positiveStat && positiveStatValue) {
              positiveStatValue = positiveStatValue * getStat(positiveStatSource, skillEffect.positiveStat);
            }

            let negativeStatValue = 0;
            let negativeStatSource = getStatSource(skillEffect.negativeStatSource, caster, target) ?? target;

            if (negativeStatSource && skillEffect.negativeStat) {
              negativeStatValue = getStat(negativeStatSource, skillEffect.negativeStat)
            }

            // TODO: Handle debuff chance and protecting against debuffs
            let skillPower = Math.ceil(positiveStatValue - negativeStatValue);

            if (skillPower < 0) {
              skillPower = 0;
            }

            if (skillPower < 0){
              skillPower = 0;
            }
            let newHp = target.hp;
            if (skillEffect.type === BattleSkillEffectType.Damage)
            {
              newHp -= skillPower;
            }
            else if(skillEffect.type === BattleSkillEffectType.Heal)
            {
              newHp += skillPower;
            }
            if (newHp < 0){
              newHp = 0
            }
            else if (newHp > target.maxHp){
              newHp = target.maxHp;
            }
            if (skillEffect.cannotKill && newHp == 0){
              newHp = 1;
            }
            let drain = target.hp - newHp;
            if (drain < 0) {
              drain = 0;
            }
            // TODO: Take into account passive drain and buffs
            let drainPower = skillEffect.drainPower ?? 0;
            if (drainPower > 1) {
              drainPower = 1;
            }
            drain = Math.ceil(drain * drainPower);
            target.hp = newHp;
            if (drain > 0) {
              let casterNewHp = caster.hp + drain;
              if (casterNewHp > caster.maxHp) {
                casterNewHp = caster.maxHp;
              }
              caster.hp = casterNewHp;
            }
          }

        }
      }

      skill.cooldown = skill.maxCooldown;
      state.phase = BattlePhase.NextTurn;
    }
  },
})

// Action creators are generated for each case reducer function
export const { initBattle, progressRound, processTurn, selectSkill, processActorSkill } = battleSlice.actions

export default battleSlice.reducer