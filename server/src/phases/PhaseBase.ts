import { NetSyncServer, NetConnection } from 'net-sync'
import { GamePhase, NetMessage } from '@shared'
import { ServerState } from '../ServerState'
import { Phase } from './Phase'
import * as _ from 'lodash'

async function delay(milliseconds: number) {
  await new Promise<void>((resolve, reject) => {
    setTimeout(() => resolve(), milliseconds)
  })
}

export abstract class PhaseBase extends Phase<GamePhase> {
  protected readonly phase: GamePhase
  protected readonly netSyncServer: NetSyncServer<NetMessage>
  protected readonly serverState: ServerState
  private readonly onClientJoinHandler: (nc: NetConnection) => void
  private readonly onClientLeaveHandler: (nc: NetConnection) => void
  private readonly onClientMessageHandler: (nc: NetConnection, nm: NetMessage) => void

  constructor(phase: GamePhase, netSyncServer: NetSyncServer<NetMessage>, serverState: ServerState) {
    super()
    this.phase = phase
    this.netSyncServer = netSyncServer
    this.serverState = serverState
    this.onClientJoinHandler = netConnection => this.onClientJoin(netConnection)
    this.onClientLeaveHandler = netConnection => this.onClientLeave(netConnection)
    this.onClientMessageHandler = (netConnection, netMessage) => this.onClientMessage(netConnection, netMessage)
  }

  protected onClientJoin(netConnection: NetConnection) {}
  protected onClientLeave(netConnection: NetConnection) {}
  protected onClientMessage(netConnection: NetConnection, netMessage: NetMessage) {}

  async onEntry(fromPhase: GamePhase): Promise<GamePhase | undefined> {
    console.log(`Enter Phase: ${this.phase}`)
    this.netSyncServer.on('connect', this.onClientJoinHandler)
    this.netSyncServer.on('disconnect', this.onClientLeaveHandler)
    this.netSyncServer.on('message', this.onClientMessageHandler as any)
    await delay(500)
    console.log('Sending phase notice', this.phase)
    _.forEach(this.serverState.getClientIds(), clientId => {
      this.netSyncServer.sendMessage(clientId, {
        type: 'PHASE',
        phase: this.phase,
      })
    })
    return
  }
  async onExit(toPhase: GamePhase): Promise<void> {
    this.netSyncServer.removeListener('connect', this.onClientJoinHandler)
    this.netSyncServer.removeListener('disconnect', this.onClientLeaveHandler)
    this.netSyncServer.removeListener('message', this.onClientMessageHandler)
    console.log(`Enter Phase: ${this.phase}`)
  }
}
