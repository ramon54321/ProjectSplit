import { RenderLayer, RenderLayerMain, RenderLayerGimbal } from './render-layers'
import { Input } from './Input'
import * as THREE from 'three'
import { Viewer } from '..'

export class Viewer3D extends Viewer {
  private readonly clock = new THREE.Clock()
  private readonly input: Input
  private readonly renderer: THREE.WebGLRenderer
  private readonly renderLayers: RenderLayer[] = []
  constructor() {
    super()
    this.input = new Input()
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.shadowMap.enabled = true
    this.renderer.autoClear = false
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)

    const renderLayerMain = new RenderLayerMain(this.renderer, this.input)
    const renderLayerGimbal = new RenderLayerGimbal(this.renderer, this.input, renderLayerMain.camera)
    this.renderLayers.push(renderLayerMain)
    this.renderLayers.push(renderLayerGimbal)

    requestAnimationFrame(this.render.bind(this))
  }
  private render() {
    requestAnimationFrame(this.render.bind(this))
    const delta = this.clock.getDelta()
    this.renderer.clear()
    this.renderLayers.forEach(renderLayer => renderLayer.render(delta))
  }
}
