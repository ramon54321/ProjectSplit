import { Resolvable, untilResolved } from 'resolvable'
import { GamePhase, NetMessage } from '@shared'
import { NetConnection } from 'net-sync'
import { PhaseBase } from './PhaseBase'
import * as _ from 'lodash'

export class PhaseDeploy extends PhaseBase {
  private readonly playerReadyMap = {} as any
  private playersReadyResolvable: Resolvable | undefined

  protected onClientJoin(netConnection: NetConnection) {
    console.log('Sending error that game is running')
    // this.sendClientGameInProgressError(netConnection)
  }
  protected onClientLeave(netConnection: NetConnection) {
    throw new Error('NOT IMPLEMENTED: onClientLeaveDeploy')
  }

  protected onClientMessage(netConnection: NetConnection, netMessage: NetMessage) {
    console.log('Message from', netConnection.id, netMessage)

    if (netMessage.type === 'SET_DEPLOY_READY') {
      const clientId = netConnection.id
      const isReady = netMessage.isReady
      this.playerReadyMap[clientId] = isReady
      this.checkResolvablePlayersReady()
    } else if (netMessage.type === 'SET_SPAWN_POSITION') {
      const clientId = netConnection.id
      const spawnPosition = netMessage.position
      this.serverState.setSpawnPosition(clientId, spawnPosition)
    }
  }

  private checkResolvablePlayersReady() {
    const isPlayersReady = _.every(this.playerReadyMap, (value, key) => value)
    if (isPlayersReady) this.playersReadyResolvable?.resolve()
  }

  async onEntry(fromPhase: GamePhase): Promise<GamePhase | undefined> {
    await super.onEntry(fromPhase)

    this.playersReadyResolvable = new Resolvable()

    _.forEach(this.serverState.getClientIds(), clientId => {
      this.playerReadyMap[clientId] = false
    })

    await untilResolved(this.playersReadyResolvable)
    return 'PLAY'
  }
  async onExit(toPhase: GamePhase): Promise<void> {
    await super.onExit(toPhase)
  }
}
