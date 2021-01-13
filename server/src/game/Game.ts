import { entityComponentBank } from '../encyclopedia'
import { System, EntityComponentBank } from '../ecs'
import { ServerState } from '../ServerState'
import { Resolvable } from 'resolvable'
import { EntityType } from '@shared'
import * as _ from 'lodash'

export abstract class Game {
  protected readonly serverState: ServerState
  protected readonly entityComponentBank: EntityComponentBank<EntityType>
  protected readonly system: System<EntityType>
  private readonly gameoverResolvable: Resolvable
  constructor(serverState: ServerState, gameoverResolvable: Resolvable) {
    this.serverState = serverState
    this.gameoverResolvable = gameoverResolvable
    this.entityComponentBank = entityComponentBank
    this.system = new System(this.entityComponentBank)
  }
  protected gameOver() {
    this.gameoverResolvable.resolve()
  }
  sync() {
    const entities = _.map(this.system.getEntities(), entity => ({
      id: entity.entityId,
      components: _.map(entity.getComponents(), c => ({
        type: Object.getPrototypeOf(c).type,
        ...c.netify(),
      })),
    }))
    this.serverState.setEntities(entities)
  }
  abstract prepare(): void
  abstract tick(): void
}