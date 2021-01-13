import { IdentityComponent } from '../encyclopedia'
import { Game } from './Game'
import * as _ from 'lodash'

export class GameDestruction extends Game {
  prepare() {
    console.log('Preparing Destruction Game')
    this.system.createEntityOfType('LIGHT_INFANTRY')
    this.system.createEntityOfType('LIGHT_INFANTRY')
  }
  tick() {
    console.log('Ticking Destruction Game')
    this.tickComponents()
    this.checkGameOver()
  }
  private tickComponents() {

  }
  private checkGameOver() {
    const identityComponents = this.system.getComponents(IdentityComponent)
    const entityCountByTeamId = _.countBy(identityComponents, identityComponent => identityComponent.teamId)
    const playersRemaining = _.keys(entityCountByTeamId).length
    if (playersRemaining > 1) return
    this.gameOver()
  }
}
