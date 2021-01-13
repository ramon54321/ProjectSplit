import { setComponentType, EntityComponentBank, Component } from '../ecs'
import { ComponentType, EntityType } from '@shared'

@setComponentType<ComponentType>('IDENTITY')
export class IdentityComponent extends Component {
  readonly clientId: string
  readonly teamId: number
  readonly entityType: EntityType
  constructor(clientId: string, teamId: number, entityType: EntityType) {
    super()
    this.clientId = clientId
    this.teamId = teamId
    this.entityType = entityType
  }
  netify() {
    return {
      teamId: this.teamId,
      entityType: this.entityType,
    }
  }
}

@setComponentType<ComponentType>('HEALTH')
export class HealthComponent extends Component {
  heal() {
    console.log('Healing')
  }
  netify() {
    return {
      health: 33,
    }
  }
}

export class AdvHealthComponent extends HealthComponent {
  heal() {
    console.log('Advanced Heal')
  }
  netify() {
    return {
      health: 47,
    }
  }
}

@setComponentType<ComponentType>('MOVEMENT')
export class MovementComponent extends Component {
  move() {
    console.log('Moving')
  }
  netify() {
    return {
      position: {
        x: 4,
        y: 2,
      },
    }
  }
}

export const entityComponentBank: EntityComponentBank<EntityType> = {
  LIGHT_INFANTRY: () => [new MovementComponent(), new HealthComponent()],
  JEEP: () => [new MovementComponent(), new AdvHealthComponent()],
}
