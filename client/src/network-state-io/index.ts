import { NetMessage, GamePhase, NetworkState } from '@shared'
import { NetworkActions } from '../NetworkActions'
import { EventEmitter } from 'events'
import { AI } from '../ai'

export declare interface NetworkStateIO {
  on(event: 'phase', listener: (phase: GamePhase) => void): this
}

export abstract class NetworkStateIO extends EventEmitter {
  protected readonly networkState: NetworkState
  protected readonly networkActions: NetworkActions
  protected readonly ai: AI
  private phase: GamePhase | undefined
  constructor(
    networkState: NetworkState,
    networkActions: NetworkActions,
    AIClass: new (networkStateIO: NetworkStateIO, networkState: NetworkState, networkActions: NetworkActions) => AI,
  ) {
    super()
    this.networkState = networkState
    this.networkActions = networkActions
    this.ai = new AIClass(this, this.networkState, this.networkActions)
    this.init()
  }
  init() {}
  async _onMessage(message: NetMessage) {
    await this.onMessage(message)
    if (this.phase === 'PLAY' && message.type === 'TICK') {
      await this.onTick(message.tick)
      await this.ai.onTick(message.tick)
    }
    await this.ai.onMessage(message)
    if (message.type === 'PHASE') {
      this.phase = message.phase
      this.emit('phase', message.phase)
    }
  }
  async _onConnect() {
    await this.onConnect()
    await this.ai.onConnect()
  }
  async _onDisconnect() {
    await this.onDisconnect()
    await this.ai.onDisconnect()
  }
  async onMessage(message: NetMessage) {}
  async onConnect() {}
  async onDisconnect() {}
  async onTick(tick: number) {}
}

import { NetworkStateIOConsole } from './NetworkStateIOConsole'
import { NetworkStateIOElectron } from './NetworkStateIOElectron'

export { NetworkStateIOConsole, NetworkStateIOElectron }
