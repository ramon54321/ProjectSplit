import { NetworkStateIO } from '../network-state-io'
import { NetworkActions } from '../NetworkActions'
import { NetMessage, NetworkState } from '@shared'

export abstract class AI {
  protected readonly networkStateIO: NetworkStateIO
  protected readonly networkState: NetworkState
  protected readonly networkActions: NetworkActions
  constructor(networkStateIO: NetworkStateIO, networkState: NetworkState, networkActions: NetworkActions) {
    this.networkStateIO = networkStateIO
    this.networkState = networkState
    this.networkActions = networkActions
    this.onInit()
  }
  onInit(): void {}
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
  onInit() {
    this.networkStateIO.on('phase', phase => {
      if (phase === 'LOBBY') this.onEnterLobby()
      else if (phase === 'DEPLOY') this.onEnterDeploy()
      else if (phase === 'PLAY') this.onEnterPlay()
    })
  }
  private onEnterLobby() {}
  private onEnterDeploy() {
    console.log('Setting Spawn Point')
    this.networkActions.setSpawnPosition(3, 4)
    console.log('Setting Deploy Ready')
    this.networkActions.setDeployReady()
  }
  private onEnterPlay() {}
  async onTick(tick: number) {}
  async onMessage(message: NetMessage) {}
  async onConnect() {}
  async onDisconnect() {}
}
