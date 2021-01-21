import { Input } from '../Input'

export abstract class Collection {
  update(delta: number): void {}
}

export abstract class RenderLayer {
  protected readonly renderer: THREE.WebGLRenderer
  protected readonly input: Input
  constructor(renderer: THREE.WebGLRenderer, input: Input) {
    this.renderer = renderer
    this.input = input
  }
  abstract render(delta: number): void
}

import { RenderLayerMain } from './RenderLayerMain'
import { RenderLayerGimbal } from './RenderLayerGimbal'

export { RenderLayerMain, RenderLayerGimbal }
