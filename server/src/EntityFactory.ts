import { System, EntityComponentBank, Entity } from './ecs'
import { ComponentIdentity } from './encyclopedia'
import * as _ from 'lodash'
import { EntityType } from '../../shared/dist'

export class EntityFactory {
  protected readonly system: System
  protected readonly entityComponentBank: EntityComponentBank<EntityType>
  constructor(system: System, entityComponentBank: EntityComponentBank<EntityType>) {
    this.system = system
    this.entityComponentBank = entityComponentBank
  }
  createEntityOfType(entityType: EntityType, clientId: string, teamId: number): Entity {
    const components = this.entityComponentBank[entityType]().concat(new ComponentIdentity(clientId, teamId, entityType))
    const entity = this.system.createEntity()
    _.forEach(components, component => {
      this.system.addComponentToEntity(entity, component)
    })
    return entity
  }
}
