import { NetMessage, NetworkState, NetworkStateEntity } from '@shared'
import { NetSyncServer } from 'net-sync'
import { Vec2 } from 'spatial-math'
import * as _ from 'lodash'

export class ServerState {
  private readonly netSyncServer: NetSyncServer<NetMessage>
  private readonly networkState: NetworkState
  private readonly teamClientIds: string[][]
  private readonly entities: NetworkStateEntity[]
  private readonly spawnPositionByClientId: Map<string, Vec2> = new Map<string, Vec2>()
  constructor(netSyncServer: NetSyncServer<NetMessage>, networkState: NetworkState) {
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
  setEntities(entities: NetworkStateEntity[]) {
    _.remove(this.entities, () => true)
    _.forEach(entities, x => this.entities.push(x))
  }
  setTeamClientIds(teamClientIds: string[][]) {
    _.remove(this.teamClientIds, () => true)
    _.forEach(teamClientIds, x => this.teamClientIds.push(x))
  }
  addClientIdToTeamId(clientId: string, teamId: number) {
    if (this.teamClientIds[teamId] === undefined) this.teamClientIds[teamId] = []
    this.teamClientIds[teamId].push(clientId)
  }
  removeClientIdFromAllTeamIds(clientId: string) {
    const teamClientIds = _.map(this.teamClientIds, team => _.filter(team, cid => cid !== clientId))
    this.setTeamClientIds(teamClientIds)
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
