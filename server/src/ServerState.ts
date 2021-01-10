import * as _ from 'lodash'
import { NetSyncServer } from 'net-sync'
import { NetMessage } from '@shared'

export class ServerState {
  private readonly netSyncServer: NetSyncServer<NetMessage>
  private readonly networkState: any
  private readonly teamClientIds: string[][]
  constructor(netSyncServer: NetSyncServer<NetMessage>, networkState: any) {
    this.netSyncServer = netSyncServer
    this.networkState = networkState

    this.teamClientIds = []
  }
  sync() {
    this.buildNetworkStateFromServerState()
    this.netSyncServer.sync()
  }
  private buildNetworkStateFromServerState() {
    this.networkState.teamClientIds = this.teamClientIds
  }
  setTeamClientIds(teamClientIds: string[][]) {
    _.remove(this.teamClientIds, () => true)
    _.forEach(teamClientIds, x => this.teamClientIds.push(x))
  }
  getClientIds(): string[] {
    return _.flatten(this.teamClientIds)
  }
}