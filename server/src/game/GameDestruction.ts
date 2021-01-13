import { ComponentIdentity, ComponentMovement } from '../encyclopedia'
import { Game } from './Game'
import * as _ from 'lodash'

export class GameDestruction extends Game {
  prepare() {
    console.log('Preparing Destruction Game')
    this.spawnInitialEntities()
  }
  tick() {
    console.log('Ticking Destruction Game')
    this.tickComponents()
    this.checkGameOver()
  }
  private tickComponents() {

  }
  private spawnInitialEntities() {
    const clientIds = this.serverState.getClientIds()
    _.forEach(clientIds, clientId => {
      const spawnPosition = this.serverState.getSpawnPosition(clientId)
      if (!spawnPosition) return
      const teamId = this.serverState.getClientTeamId(clientId)
      const entity = this.entityFactory.createEntityOfType('LIGHT_INFANTRY', clientId, teamId)
      entity.getComponent(ComponentMovement).setPosition(spawnPosition)
    })
  }
  private checkGameOver() {
    const identityComponents = this.system.getComponents(ComponentIdentity)
    const entityCountByTeamId = _.countBy(identityComponents, identityComponent => identityComponent.teamId)
    const playersRemaining = _.keys(entityCountByTeamId).length
    if (playersRemaining > 1) return
    this.gameOver()
  }
}
