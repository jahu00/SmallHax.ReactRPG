import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { BattlePhase } from './types/battle-phase'
import { BattleActorState } from './types/battle-actor-state'
import { BattleTeam } from 'types/battle/battle-team'
import { BattleActorData } from 'types/battle/battle-actor-data'
import { BattleSkillUse } from './types/battle-skill-use'
import { BattleSkillData, BattleSkillEffect, BattleSkillCondition, BattleSkillEffectStatSource, BattleSkillEffectType, BattleSkillEffetTarget } from 'types/battle/battle-skill-data'
import { BattleSkillState } from './types/battle-skill-state'
import { BattleState } from './types/battle-state'
import { BattleSkillActionType } from 'types/battle/battle-skill-action-type'
import { getRandomItem } from 'utils/math'
import { BattleActorSetAnimation } from './types/battle-actor-set-animation'
import { BattleBuffState } from './types/battle-buff-state'
import { BattleBuffEffectType, StatModifierType } from 'types/battle/battle-buff-data'
import { InitBattlePayload } from './types/init-battle-payload'

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

export function toBattleActorStats(stats: Record<string, number>, buffs?: BattleBuffState[]): Record<string, number> {
  let result: Record<string, number> = {};
  for (let statName in stats){
    let a = 1;
    let b = 0;
    if (buffs){
      for (let buff of buffs){
        const buffPower = buff.power ?? 1;
        for (let buffEffect of buff.effects){
          if (buffEffect.type != BattleBuffEffectType.ChangeStat){
            continue;
          }
          if (buffEffect.statName !== statName){
            continue;
          }
          if (buffEffect.modifierType === StatModifierType.Multiplication) {
            a += (buffEffect.power ?? 0) * buffPower;
          }
          if (buffEffect.modifierType === StatModifierType.Flat) {
            b += (buffEffect.power ?? 0) * buffPower;
          }
        }
      }
    }
    result[statName] = Math.ceil(stats[statName] * a + b);
  }
  return result;
}

export function recalculateStats(actor: BattleActorState) {
  actor.stats = toBattleActorStats(actor.baseStats, actor.buffs);
  if (actor.hp > actor.stats.maxHp) {
    actor.hp = actor.stats.maxHp;
  }
}

export function toBattleActorState(actor: BattleActorData, team: BattleTeam, id: number, slotId: number) : BattleActorState{
  return {
    ...actor,
    hp: actor.baseStats.maxHp,
    team: team,
    id: id,
    slotId: slotId,
    skills: toBattleSkillStates(actor.skills),
    stats: toBattleActorStats(actor.baseStats, []),
    buffs: []
  };
}

export function toBattleActorStates(actors: BattleActorData[], team: BattleTeam, index: number): BattleActorState[]{
  return actors.map((x, i) => toBattleActorState(x, team, index + i, i));
}

export function preparePlayerTeam(actors: BattleActorState[]): BattleActorState[]{
  const newBuffs: BattleBuffState[] = [];
  let result = actors.map(x => ({...x, stats: toBattleActorStats(x.baseStats, newBuffs), buffs: newBuffs}));
  for (let actor of actors) {
    if (actor.hp > actor.stats.maxHp) {
      actor.hp = actor.stats.maxHp;
    }
  }
  return result;
}

export function getActorTurnOrder(actors: BattleActorState[]): number[] {
  const turnOrder = actors.map((x, i) => ({index: i, speed: x.stats.speed}))
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
  const stats: Record<string,number> = {...actor.stats, hp: actor.hp};
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
    initBattle: (state, action: PayloadAction<InitBattlePayload>) => {
      const payload = action.payload;
      state.phase = BattlePhase.NextRound;
      state.round = 0;
      state.turn = 0;
      state.currentActorId = null;
      state.selectedSkillId = null;
      let actors: BattleActorState[] = preparePlayerTeam(payload.playerParty); //;toBattleActorStates(payload.playerParty, BattleTeam.Player, 0);
      actors = actors.concat(toBattleActorStates(payload.battleData.enemies, BattleTeam.Enemy, actors.length));
      state.actors = actors;
      state.background = payload.battleData.background;
    },
    progressRound: (state) => {
      state.turnOrder = getActorTurnOrder(state.actors);
      state.turn = -1;
      state.round += 1;
      state.phase = BattlePhase.NextTurn;
    },
    processTurn: (state) => {
      // TODO: Recalculate remaining turn order
      state.selectedSkillId = null;
      state.currentActorId = null;

      for (let actor of state.actors){
        if (actor.animationName){
          actor.animationName = undefined;
        }
      }
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
      } while(isDead(actor))

      for(let skill of actor.skills) {
        if (skill.cooldown > 0){
          skill.cooldown -= 1;
        }
      }

      for(let buff of actor.buffs) {
        // TODO: Infinite buff?
        buff.duration -= 1;
      }

      actor.buffs = actor.buffs.filter(x => x.duration > 0);
      recalculateStats(actor);

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
            if (skillEffect.type === BattleSkillEffectType.Damage) {
              newHp -= skillPower;
              if (target.id !== caster.id){
                target.animationName = "hurting";
              }
            }
            if(skillEffect.type === BattleSkillEffectType.Heal) {
              newHp += skillPower;
              if (target.id !== caster.id){
                target.animationName = "healing";
              }
            }
            if(skillEffect.type === BattleSkillEffectType.Buff && skillEffect.applyBuffs) {
              for (let buff of skillEffect.applyBuffs){
                // TODO: compute chance to apply
                const existingIndex = target.buffs.findIndex(x => x.group === buff.group);
                const buffState: BattleBuffState = {...buff, duration: buff.maxDuration};
                if (existingIndex > -1){
                  target.buffs[existingIndex] = buffState;
                }
                else {
                  target.buffs.push(buffState);
                }
              }
            }
            if (newHp < 0){
              newHp = 0
            }
            else if (newHp > target.stats.maxHp){
              newHp = target.stats.maxHp;
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
              if (casterNewHp > caster.stats.maxHp) {
                casterNewHp = caster.stats.maxHp;
              }
              caster.hp = casterNewHp;
            }
            recalculateStats(target);
          }

        }
      }

      skill.cooldown = skill.maxCooldown;
      state.phase = BattlePhase.ActorUsesSkill;
    },
    setActorAnimation: (state, action: PayloadAction<BattleActorSetAnimation>) => {
      const actor = state.actors[action.payload.actorId];
      actor.animationName = action.payload.animationName;
    }
  },
})

// Action creators are generated for each case reducer function
export const { initBattle, progressRound, processTurn, selectSkill, processActorSkill, setActorAnimation } = battleSlice.actions

export default battleSlice.reducer