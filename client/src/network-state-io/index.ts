import { NetMessage, NM_Phase, GamePhase } from '@shared'
import { Resolvable, untilResolved } from 'resolvable'
import { NetworkActions } from '../NetworkActions'
import { AI } from '../ai'

export abstract class NetworkStateIO {
  protected readonly networkState: any
  protected readonly networkActions: NetworkActions
  protected readonly ai: AI
  private phase: GamePhase | undefined
  readonly lobbyConfirmation = new Resolvable()
  readonly deployConfirmation = new Resolvable()
  readonly playConfirmation = new Resolvable()
  constructor(
    networkState: any,
    networkActions: NetworkActions,
    AIClass: new (networkStateIO: NetworkStateIO, networkState: any, networkActions: NetworkActions) => AI,
  ) {
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
      this.checkForPhaseConfirmation(message, 'LOBBY', this.lobbyConfirmation)
      this.checkForPhaseConfirmation(message, 'DEPLOY', this.deployConfirmation)
      this.checkForPhaseConfirmation(message, 'PLAY', this.playConfirmation)
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
  async untilPhaseConfirmation(resolvable: Resolvable) {
    await untilResolved(resolvable)
  }
  private checkForPhaseConfirmation(message: NM_Phase, phase: GamePhase, resolvable: Resolvable) {
    if (!resolvable.hasResolved()) {
      if (message.phase === phase) {
        resolvable.resolve()
        this.phase = phase
      }
    }
  }

  async onMessage(message: NetMessage) {}
  async onConnect() {}
  async onDisconnect() {}
  async onTick(tick: number) {}
}

import { NetworkStateIOConsole } from './NetworkStateIOConsole'
import { NetworkStateIOElectron } from './NetworkStateIOElectron'

export { NetworkStateIOConsole, NetworkStateIOElectron }
