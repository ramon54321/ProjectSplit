import { RenderLayerMain, RenderLayerGimbal } from './render-layers'
import { NetworkState } from '@shared'
import { Assets } from './Assets'
import { Input } from './Input'
import * as THREE from 'three'
import { Viewer } from '..'

export class Viewer3D extends Viewer {
  private readonly clock = new THREE.Clock()
  private readonly assets: Assets
  private readonly input: Input
  private readonly renderer: THREE.WebGLRenderer
  private readonly renderLayerMain: RenderLayerMain
  private readonly renderLayerGimbal: RenderLayerGimbal
  constructor() {
    super()
    this.assets = new Assets()
    this.input = new Input()
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.shadowMap.enabled = true
    this.renderer.autoClear = false
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)

    this.renderLayerMain = new RenderLayerMain(this.renderer, this.assets, this.input)
    this.renderLayerGimbal = new RenderLayerGimbal(this.renderer, this.assets, this.input, this.renderLayerMain.getCamera())

    requestAnimationFrame(this.render.bind(this))
  }
  private render() {
    requestAnimationFrame(this.render.bind(this))
    const delta = this.clock.getDelta()
    this.renderer.clear()
    this.renderLayerMain.render(delta)
    this.renderLayerGimbal.render(delta)
  }
  updateNetworkState(networkState: NetworkState): void {
    this.renderLayerMain.updateNetworkState(networkState)
  }
}
