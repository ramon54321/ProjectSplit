import { Vec2 } from 'spatial-math'

export type GamePhase = 'LOBBY' | 'DEPLOY' | 'PLAY'
export type ComponentType = 'IDENTITY' | 'HEALTH' | 'MOVEMENT'
export type EntityType = 'LIGHT_INFANTRY' | 'JEEP'

export type NetMessage = NM_Phase | NM_SetSpawnPosition | NM_SetDeployReady | NM_Tick
export interface NM_Phase {
  type: 'PHASE'
  phase: GamePhase | undefined
}
export interface NM_SetSpawnPosition {
  type: 'SET_SPAWN_POSITION'
  position: Vec2
}
export interface NM_SetDeployReady {
  type: 'SET_DEPLOY_READY'
  isReady: boolean
}
export interface NM_Tick {
  type: 'TICK'
  tick: number
}

export interface INetifyable {
  netify(): any
}
