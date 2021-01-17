import { NetworkStateIO } from './network-state-io'
import { NetworkActions } from './NetworkActions'
import { NetSyncClient } from 'net-sync'
import { NetMessage } from '@shared'
import * as _ from 'lodash'
import { AI } from './ai'

export class Init {
  private readonly networkState: any
  private readonly netSyncClient: NetSyncClient<NetMessage>
  private readonly networkActions: NetworkActions
  private readonly networkStateIO: NetworkStateIO
  constructor(
    host: string,
    port: number,
    NetworkStateIOClass: new (
      networkState: any,
      networkActions: NetworkActions,
      AIClass: new (networkStateIO: NetworkStateIO, networkActions: NetworkActions) => AI,
    ) => NetworkStateIO,
    AIClass: new (networkStateIO: NetworkStateIO, networkActions: NetworkActions) => AI,
  ) {
    this.networkState = {}
    this.netSyncClient = new NetSyncClient<NetMessage>(this.networkState, host, port)
    this.networkActions = new NetworkActions(this.netSyncClient)
    this.networkStateIO = new NetworkStateIOClass(this.networkState, this.networkActions, AIClass)
    this.netSyncClient.on('message', message => this.networkStateIO._onMessage(message as any))
    this.netSyncClient.on('connect', connection => this.networkStateIO._onConnect())
    this.netSyncClient.on('disconnect', connection => this.networkStateIO._onDisconnect())
  }
}
