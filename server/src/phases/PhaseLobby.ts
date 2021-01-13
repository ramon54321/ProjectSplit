import { NetSyncServer, NetConnection } from 'net-sync'
import { Resolvable, untilResolved } from 'resolvable'
import { ClientManager } from '../ClientManager'
import { GamePhase, NetMessage } from '@shared'
import { ServerState } from '../ServerState'
import { PhaseBase } from './PhaseBase'
import * as _ from 'lodash'

export class PhaseLobby extends PhaseBase {
  private readonly clientManager: ClientManager
  private sufficientClientsResolvable: Resolvable | undefined

  constructor(phase: GamePhase, netSyncServer: NetSyncServer<NetMessage>, serverState: ServerState, clientManager: ClientManager) {
    super(phase, netSyncServer, serverState)
    this.clientManager = clientManager
  }

  protected onClientJoin(netConnection: NetConnection) {
    this.netSyncServer.sendMessage(netConnection.id, {
      type: 'PHASE',
      phase: 'LOBBY',
    })
    this.organizeTeams(1)
    this.checkResolvableClientsCount()
  }

  private checkResolvableClientsCount() {
    if (this.hasSufficientClientsToStart()) this.sufficientClientsResolvable?.resolve()
  }

  private organizeTeams(playersPerTeam: number) {
    const clientIds = this.clientManager.getClientIds()
    const teamedClientIds = _.chunk(clientIds, playersPerTeam)
    this.serverState.setTeamClientIds(teamedClientIds)
    this.serverState.sync()
  }

  private hasSufficientClientsToStart(): boolean {
    return this.clientManager.getClientCount() >= 2
  }

  async onEntry(fromPhase: GamePhase): Promise<GamePhase | undefined> {
    await super.onEntry(fromPhase)
    this.sufficientClientsResolvable = new Resolvable()
    await untilResolved(this.sufficientClientsResolvable)
    return 'DEPLOY'
  }
  async onExit(toPhase: GamePhase): Promise<void> {
    await super.onExit(toPhase)
  }
}
