import { Assets } from '../Assets'
import { Input } from '../Input'
import { RenderLayer } from '.'
import * as THREE from 'three'

export class RenderLayerGimbal extends RenderLayer {
  private readonly scene: THREE.Scene
  private readonly camera: THREE.Camera
  private readonly mainCamera: THREE.Camera
  private readonly textureDot: THREE.Texture
  constructor(renderer: THREE.WebGLRenderer, assets: Assets, input: Input, mainCamera: THREE.Camera) {
    super(renderer, assets, input)
    this.mainCamera = mainCamera
    this.scene = new THREE.Scene()
    this.camera = new THREE.OrthographicCamera(-1.4, 1.4, 1.4, -1.4, -4, 4)
    this.textureDot = assets.getTexture('dot.png')
    this.createDot([new THREE.Vector3(1, 0, 0)], 12, new THREE.Color('#ef4f4f'))
    this.createDot([new THREE.Vector3(0, 1, 0)], 12, new THREE.Color('#96bb7c'))
    this.createDot([new THREE.Vector3(0, 0, 1)], 12, new THREE.Color('#3e64ff'))
    this.createLine([new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0)], new THREE.Color('#ef4f4f'))
    this.createLine([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0)], new THREE.Color('#96bb7c'))
    this.createLine([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1)], new THREE.Color('#3e64ff'))
  }
  private createDot(vertices: THREE.Vector3[], size: number, color: THREE.Color) {
    const geometry = new THREE.BufferGeometry().setFromPoints(vertices)
    const material = new THREE.PointsMaterial({ size: size, sizeAttenuation: false, map: this.textureDot, transparent: true })
    material.color.set(color)
    const points = new THREE.Points(geometry, material)
    this.scene.add(points)
    return points
  }
  private createLine(vertices: THREE.Vector3[], color: THREE.Color) {
    const geometry = new THREE.BufferGeometry().setFromPoints(vertices)
    const material = new THREE.LineBasicMaterial({ color: color })
    const line = new THREE.Line(geometry, material)
    this.scene.add(line)
    return line
  }
  render() {
    this.camera.rotation.set(this.mainCamera.rotation.x, this.mainCamera.rotation.y, this.mainCamera.rotation.z)
    this.renderer.clearDepth()
    this.renderer.setViewport(0, 0, 200, 200)
    this.renderer.render(this.scene, this.camera)
  }
}
