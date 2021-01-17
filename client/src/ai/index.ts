import { NetworkStateIO } from '../network-state-io'
import { NetworkActions } from '../NetworkActions'
import { NetMessage } from '@shared'

export abstract class AI {
  protected readonly networkStateIO: NetworkStateIO
  protected readonly networkActions: NetworkActions
  constructor(networkStateIO: NetworkStateIO, networkActions: NetworkActions) {
    this.networkStateIO = networkStateIO
    this.networkActions = networkActions
  }
  abstract onMessage(message: NetMessage): Promise<void>
  abstract onConnect(): Promise<void>
  abstract onDisconnect(): Promise<void>
  abstract onTick(tick: number): Promise<void>
}

export class AINull extends AI {
  async onTick(tick: number) {}
  async onMessage(message: NetMessage) {}
  async onConnect() {}
  async onDisconnect() {}
}

export class AIBasic extends AI {
  async onTick(tick: number) {}
  async onMessage(message: NetMessage) {}
  async onConnect() {
    console.log('Connected to server')
    console.log('Waiting for Lobby Phase')
    await this.networkStateIO.untilPhaseConfirmation(this.networkStateIO.lobbyConfirmation)
    console.log('Waiting for Deploy Phase')
    await this.networkStateIO.untilPhaseConfirmation(this.networkStateIO.deployConfirmation)
    console.log('Setting Spawn Point')
    this.networkActions.setSpawnPosition(3, 4)
    console.log('Setting Deploy Ready')
    this.networkActions.setDeployReady()
    console.log('Waiting for Play Phase')
    await this.networkStateIO.untilPhaseConfirmation(this.networkStateIO.playConfirmation)
    console.log('Starting to Play')
  }
  async onDisconnect() {}
}
