import { NetworkActions } from '../NetworkActions'
import { NetMessage } from '@shared'

export abstract class NetworkStateIO {
  protected readonly networkState: any
  protected readonly networkActions: NetworkActions
  constructor(networkState: any, networkActions: NetworkActions) {
    this.networkState = networkState
    this.networkActions = networkActions
  }
  abstract async onMessage(message: NetMessage): Promise<void>
  abstract async onConnect(): Promise<void>
  abstract async onDisconnect(): Promise<void>
}

import { NetworkStateIOConsole } from './NetworkStateIOConsole'
import { NetworkStateIOAI } from './NetworkStateIOAI'

export { NetworkStateIOConsole, NetworkStateIOAI }