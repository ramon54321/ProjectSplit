import { Resolvable, untilResolved } from 'resolvable'
import { GamePhase, NetMessage } from '@shared'
import { NetConnection } from 'net-sync'
import { PhaseBase } from './PhaseBase'
import * as _ from 'lodash'

export class PhasePlay extends PhaseBase {
  private tickCount = 0
  private tickIntervalHandle: any
  private tickInterval = 5000
  private gameoverResolvable: Resolvable | undefined

  async onEntry(fromPhase: GamePhase): Promise<GamePhase | undefined> {
    await super.onEntry(fromPhase)
    console.log('PhasePlay Enter')

    this.tickIntervalHandle = setInterval(() => this.tick(), this.tickInterval)

    this.gameoverResolvable = new Resolvable()
    await untilResolved(this.gameoverResolvable)

    return undefined
  }
  async onExit(toPhase: GamePhase): Promise<void> {
    await super.onExit(toPhase)
    
    clearInterval(this.tickIntervalHandle)

    console.log('PhasePlay Exit')
  }
  protected onClientMessage(netConnection: NetConnection, netMessage: NetMessage) {
    console.log('Dealing with player play request')
  }
  private tick() {
    console.log('-----------------------TICK-----------------------')

    // // Tick all components
    // ComponentHealth.instances.forEach(instance => instance.tick())
    // ComponentMorale.instances.forEach(instance => instance.tick())
    // ComponentMovement.instances.forEach(instance => instance.tick())

    // // Build Network State
    // buildNetworkState(networkState)

    // // console.log(JSON.stringify(networkState, null, 2))
    // console.log(networkState.entityMap[0].components.COMPONENT_MOVEMENT)

    // Sync Clients
    this.netSyncServer.sync()
    this.broadcastTickMessage()
    this.tickCount++
  }

  private broadcastTickMessage() {
    _.forEach(this.serverState.getClientIds(), clientId => {
      this.netSyncServer.sendMessage(clientId, {
        type: 'TICK',
        tick: this.tickCount,
      })
    })
  }
}
