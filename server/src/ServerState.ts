import * as _ from 'lodash'
import { NetSyncServer } from 'net-sync'
import { NetMessage } from '@shared'

interface EntityNetworkState {
  id: number
  components: any[]
}

export class ServerState {
  private readonly netSyncServer: NetSyncServer<NetMessage>
  private readonly networkState: any
  private readonly teamClientIds: string[][]
  private readonly entities: EntityNetworkState[]
  constructor(netSyncServer: NetSyncServer<NetMessage>, networkState: any) {
    this.netSyncServer = netSyncServer
    this.networkState = networkState

    this.teamClientIds = []
    this.entities = []
  }
  sync() {
    this.buildNetworkStateFromServerState()
    this.netSyncServer.sync()
  }
  private buildNetworkStateFromServerState() {
    this.networkState.teamClientIds = this.teamClientIds
    this.networkState.entities = this.entities
  }
  setEntities(entities: EntityNetworkState[]) {
    _.remove(this.entities, () => true)
    _.forEach(entities, x => this.entities.push(x))
  }
  setTeamClientIds(teamClientIds: string[][]) {
    _.remove(this.teamClientIds, () => true)
    _.forEach(teamClientIds, x => this.teamClientIds.push(x))
  }
  getClientIds(): string[] {
    return _.flatten(this.teamClientIds)
  }
}