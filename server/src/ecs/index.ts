import { INetifyable } from '@shared'

export function setComponentType<T>(type: T) {
  return (constructor: Function) => {
    constructor.prototype.type = type
  }
}

export type EntityComponentBank<T extends string> = { [key in T]: () => Component[] }

export class Entity {
  readonly entityId: number
  private readonly _componentMap = new Map<string, Component>()
  constructor(entityId: number) {
    this.entityId = entityId
  }
  addComponent(component: Component) {
    component.__setEntityId(this.entityId)
    const key = Object.getPrototypeOf(component).type
    this._componentMap.set(key, component)
  }
  getComponent<T>(componentClass: Function & { prototype: T }): T {
    const key = componentClass.prototype.type
    return (this._componentMap.get(key) as unknown) as T
  }
  getComponents(): Component[] {
    return Array.from(this._componentMap.values())
  }
}

export class System<E extends string> {
  private entityComponentBank: EntityComponentBank<E>
  private entityIdCounter = 0
  private readonly _componentMap = new Map<string, Component[]>()
  private readonly _entityMap = new Map<number, Entity>()
  constructor(entityComponentBank: EntityComponentBank<E>) {
    this.entityComponentBank = entityComponentBank
  }
  createEntityOfType(entityType: E): Entity {
    const components = this.entityComponentBank[entityType]()
    return this.createEntityWithComponents(components)
  }
  private createEntityWithComponents(components: Component[]): Entity {
    const entityId = this.entityIdCounter++
    const entity = new Entity(entityId)
    components.forEach(component => entity.addComponent(component))
    components.forEach(component => this.addComponent(component))
    this._entityMap.set(entityId, entity)
    return entity
  }
  getEntities(): Entity[] {
    return Array.from(this._entityMap.values())
  }
  getEntityById(entityId: number): Entity | undefined {
    return this._entityMap.get(entityId)
  }
  private addComponent(component: Component) {
    const key = Object.getPrototypeOf(component).type
    if (!this._componentMap.has(key)) this._componentMap.set(key, [])
    this._componentMap.get(key)!.push(component)
  }
  getComponents<T>(componentClass: Function | { prototype: T }): T[] {
    const key = componentClass.prototype.type
    return (this._componentMap.get(key) as unknown) as T[]
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
