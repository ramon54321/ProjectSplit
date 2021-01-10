import { NetMessage, NM_Phase, GamePhase } from '@shared'
import { Resolvable, untilResolved } from 'resolvable'
import { NetworkStateIO } from '.'

export class NetworkStateIOAI extends NetworkStateIO {
  private phase: GamePhase | undefined
  private readonly lobbyConfirmation = new Resolvable()
  private readonly deployConfirmation = new Resolvable()
  private readonly playConfirmation = new Resolvable()

  async onConnect() {
    console.log('Connected to server')
    console.log('Waiting for Lobby Phase')
    await this.untilPhaseConfirmation('LOBBY', this.lobbyConfirmation)
    console.log('Waiting for Deploy Phase')
    await this.untilPhaseConfirmation('DEPLOY', this.deployConfirmation)
    console.log('Setting Spawn Point')
    this.networkActions.setSpawnPoint(3, 4)
    console.log('Setting Deploy Ready')
    this.networkActions.setDeployReady()
    console.log('Waiting for Play Phase')
    await this.untilPhaseConfirmation('PLAY', this.playConfirmation)
    console.log('Starting to Play')
  }
  async onDisconnect() {
    console.log('Disconnected from server')
  }
  async onMessage(message: NetMessage) {
    if (message.type === 'PHASE') {
      this.checkForPhaseConfirmation(message, 'LOBBY', this.lobbyConfirmation)
      this.checkForPhaseConfirmation(message, 'DEPLOY', this.deployConfirmation)
      this.checkForPhaseConfirmation(message, 'PLAY', this.playConfirmation)
    } else if (this.phase === 'PLAY' && message.type === 'TICK') {
      this.playTick(message.tick)
    }
  }

  private playTick(tick: number) {
    console.log('Playing tick', tick)
  }

  private async untilPhaseConfirmation(phase: GamePhase, resolvable: Resolvable) {
    await untilResolved(resolvable)
    this.phase = phase
  }

  private checkForPhaseConfirmation(message: NM_Phase, phase: GamePhase, resolvable: Resolvable) {
    if (!resolvable.hasResolved()) {
      if (message.phase === phase) {
        resolvable.resolve()
      }
    }
  }
}