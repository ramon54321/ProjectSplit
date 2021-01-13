import { Resolvable, untilResolved } from 'resolvable'
import { Game, GameDestruction } from '../game'
import { GamePhase, NetMessage } from '@shared'
import { ensure } from '@shared/validation'
import { NetConnection } from 'net-sync'
import { PhaseBase } from './PhaseBase'
import * as _ from 'lodash'

export class PhasePlay extends PhaseBase {
  private tickCount = 0
  private tickIntervalHandle: any
  private tickInterval = 5000
  private gameoverResolvable: Resolvable | undefined
  private game: Game | undefined

  protected onClientMessage(netConnection: NetConnection, netMessage: NetMessage) {
    console.log('Dealing with player play request')
  }

  async onEntry(fromPhase: GamePhase): Promise<GamePhase | undefined> {
    await super.onEntry(fromPhase)

    this.gameoverResolvable = new Resolvable()

    this.prepare()
    this.startTickInterval()

    await untilResolved(this.gameoverResolvable)

    return undefined
  }

  async onExit(toPhase: GamePhase): Promise<void> {
    this.stopTickInterval()
    await super.onExit(toPhase)
  }

  private startTickInterval() {
    this.tickIntervalHandle = setInterval(() => this.tick(), this.tickInterval)
  }

  private stopTickInterval() {
    clearInterval(this.tickIntervalHandle)
  }

  private prepare() {
    this.game = new GameDestruction(this.serverState, ensure(this.gameoverResolvable))
    // this.game = new GameDestruction(this.serverState, this.gameoverResolvable!)
    this.game.prepare()
  }

  private tick() {
    console.log('-----------------------TICK-----------------------')
    this.game?.tick()
    this.game?.sync()
    this.serverState.sync()
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
