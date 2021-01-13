import * as _ from 'lodash'
import { NetSyncServer } from 'net-sync'
import { NetMessage } from '@shared'
import { Vec2 } from 'spatial-math'

interface EntityNetworkState {
  id: number
  components: any[]
}

export class ServerState {
  private readonly netSyncServer: NetSyncServer<NetMessage>
  private readonly networkState: any
  private readonly teamClientIds: string[][]
  private readonly entities: EntityNetworkState[]
  private readonly spawnPositionByClientId: Map<string, Vec2> = new Map<string, Vec2>()
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
  setSpawnPosition(clientId: string, spawnPosition: Vec2) {
    this.spawnPositionByClientId.set(clientId, spawnPosition)
  }
  getSpawnPosition(clientId: string): Vec2 | undefined {
    return this.spawnPositionByClientId.get(clientId)
  }
  getClientIds(): string[] {
    return _.flatten(this.teamClientIds)
  }
  getClientTeamId(clientId: string): number {
    return _.findIndex(this.teamClientIds, clientIds => _.includes(clientIds, clientId))
  }
}