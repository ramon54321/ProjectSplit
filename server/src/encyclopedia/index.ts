import { setComponentType, EntityComponentBank, Component } from '../ecs'
import { ComponentType, EntityType } from '@shared'
import { Vec2 } from 'spatial-math'

@setComponentType<ComponentType>('IDENTITY')
export class ComponentIdentity extends Component {
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
export class ComponentHealth extends Component {
  heal() {
    console.log('Healing')
  }
  netify() {
    return {
      health: 33,
    }
  }
}

export class ComponentAdvHealth extends ComponentHealth {
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
export class ComponentMovement extends Component {
  private position: Vec2 = new Vec2()
  setPosition(position: Vec2) {
    this.position.x = position.x
    this.position.y = position.y
  }
  move() {
    console.log('Moving')
  }
  netify() {
    return {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
    }
  }
}

export const entityComponentBank: EntityComponentBank<EntityType> = {
  LIGHT_INFANTRY: () => [new ComponentMovement(), new ComponentHealth()],
  JEEP: () => [new ComponentMovement(), new ComponentAdvHealth()],
}
