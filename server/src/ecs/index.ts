import { INetifyable } from '@shared'

export function setComponentType<T>(type: T) {
  return (constructor: Function) => {
    constructor.prototype.type = type
  }
}

export type EntityComponentBank<T extends string> = { [key in T]: () => Component[] }

export class Entity {
  readonly entityId: number
  private readonly componentMap = new Map<string, Component>()
  constructor(entityId: number) {
    this.entityId = entityId
  }
  __addComponent(component: Component) {
    component.__setEntityId(this.entityId)
    const key = Object.getPrototypeOf(component).type
    this.componentMap.set(key, component)
  }
  getComponent<T>(componentClass: Function & { prototype: T }): T {
    const key = componentClass.prototype.type
    return (this.componentMap.get(key) as unknown) as T
  }
  getComponents(): Component[] {
    return Array.from(this.componentMap.values())
  }
}

export class System {
  private entityIdCounter = 0
  private readonly componentMap = new Map<string, Component[]>()
  private readonly entityMap = new Map<number, Entity>()
  createEntity(): Entity {
    const entityId = this.entityIdCounter++
    const entity = new Entity(entityId)
    this.entityMap.set(entityId, entity)
    return entity
  }
  addComponentToEntity(entity: Entity, component: Component) {
    entity.__addComponent(component)
    this.addComponent(component)
  }
  getEntities(): Entity[] {
    return Array.from(this.entityMap.values())
  }
  getEntityById(entityId: number): Entity | undefined {
    return this.entityMap.get(entityId)
  }
  private addComponent(component: Component) {
    const key = Object.getPrototypeOf(component).type
    if (!this.componentMap.has(key)) this.componentMap.set(key, [])
    this.componentMap.get(key)!.push(component)
  }
  getComponents<T>(componentClass: Function | { prototype: T }): T[] {
    const key = componentClass.prototype.type
    return (this.componentMap.get(key) as unknown) as T[]
  }
}

export abstract class Component implements INetifyable {
  abstract netify(): any
  private entityId: number | undefined
  __setEntityId(entityId: number) {
    this.entityId = entityId
  }
  getEntityId(): number {
    return this.entityId!
  }
}
