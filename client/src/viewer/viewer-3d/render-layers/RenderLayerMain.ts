import { RenderLayer, Collection } from '.'
import { degreesToRadians } from '../math'
import { Input } from '../Input'
import * as THREE from 'three'

export class RenderLayerMain extends RenderLayer {
  private readonly scene: THREE.Scene
  readonly camera: THREE.Camera
  private readonly collectionLights: Collection
  private readonly collectionTerrain: Collection
  private readonly collectionEntities: Collection
  private readonly cameraBaseSpeed: number = 10
  private readonly cameraZoomSpeedMultiplier: number = 2.4
  private readonly cameraZoomMin: number = 0
  private readonly cameraZoomMax: number = 8
  private readonly cameraBaseHeight: number = 6
  private readonly cameraBaseDip: number = 20
  private readonly cameraTargetTranslation: THREE.Vector3
  private readonly cameraTargetRotation: THREE.Euler
  private cameraZoom: number = 0
  constructor(renderer: THREE.WebGLRenderer, input: Input) {
    super(renderer, input)

    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2('#faf5ef', 0.015)
    this.scene.background = new THREE.Color('#faf5ef')

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.z = 5
    this.camera.position.y = this.cameraBaseHeight

    this.cameraTargetTranslation = this.camera.position.clone()
    this.cameraTargetTranslation.z = 7
    this.cameraTargetRotation = this.camera.rotation.clone()

    this.collectionLights = new CollectionLightsDaylight(this.scene)
    this.collectionTerrain = new CollectionTerrainFlatGrid(this.scene, this.renderer.capabilities.getMaxAnisotropy())
    this.collectionEntities = new CollectionEntitiesCube(this.scene)
  }
  render(delta: number) {
    this.updateCamera(delta)
    this.collectionEntities.update(delta)
    this.renderer.clearDepth()
    this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight)
    this.renderer.render(this.scene, this.camera)
  }
  private updateCamera(delta: number) {
    const cameraSpeed = this.cameraBaseSpeed + this.cameraZoom * this.cameraZoomSpeedMultiplier
    if (this.input.keyDownMap['a']) {
      this.cameraTargetTranslation.x -= cameraSpeed * delta
    } else if (this.input.keyDownMap['d']) {
      this.cameraTargetTranslation.x += cameraSpeed * delta
    }
    if (this.input.keyDownMap['w']) {
      this.cameraTargetTranslation.z -= cameraSpeed * delta
    } else if (this.input.keyDownMap['s']) {
      this.cameraTargetTranslation.z += cameraSpeed * delta
    }
    if (this.input.keyDownMap['q']) {
      this.cameraZoom += 10 * delta
    } else if (this.input.keyDownMap['e']) {
      this.cameraZoom -= 10 * delta
    }
    if (this.cameraZoom < this.cameraZoomMin) this.cameraZoom = this.cameraZoomMin
    if (this.cameraZoom > this.cameraZoomMax) this.cameraZoom = this.cameraZoomMax

    // Calculate Target Translation
    const cameraHeightTarget = this.cameraZoom * 3 + this.cameraBaseHeight
    this.cameraTargetTranslation.y = cameraHeightTarget

    // Set Translation
    const cameraFrameTranslationDelta = this.cameraTargetTranslation.clone().sub(this.camera.position).multiplyScalar(0.2)
    this.camera.position.add(cameraFrameTranslationDelta)

    // Calculate Target Rotation
    const cameraDipTarget = -this.camera.position.y * 2 - this.cameraBaseDip
    this.cameraTargetRotation.x = degreesToRadians(cameraDipTarget)

    // Set Rotation
    this.camera.rotation.set(this.cameraTargetRotation.x, this.cameraTargetRotation.y, this.cameraTargetRotation.z)
  }
}

class CollectionLightsDaylight extends Collection {
  constructor(scene: THREE.Scene) {
    super()
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6)
    hemiLight.color.setHSL(0.6, 1, 0.6)
    hemiLight.groundColor.setHSL(0.095, 1, 0.75)
    hemiLight.position.set(0, 3, 0)
    scene.add(hemiLight)

    // const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 1)
    // this.scene.add(hemiLightHelper)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.color.setHSL(0.1, 1, 0.95)
    dirLight.position.set(-1, 1.75, 1)
    scene.add(dirLight)

    dirLight.castShadow = true

    dirLight.shadow.mapSize.width = 2048
    dirLight.shadow.mapSize.height = 2048

    const d = 5

    dirLight.shadow.camera.left = -d
    dirLight.shadow.camera.right = d
    dirLight.shadow.camera.top = d
    dirLight.shadow.camera.bottom = -d

    dirLight.shadow.camera.far = 3500
    dirLight.shadow.bias = -0.00001

    // const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 1)
    // this.scene.add(dirLightHelper)
  }
}

class CollectionTerrainFlatGrid extends Collection {
  constructor(scene: THREE.Scene, anisotropy: number) {
    super()
    const planeSize = 1000
    const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize)
    const texture = new THREE.TextureLoader().load('resources/grid1x1.png')
    texture.anisotropy = anisotropy
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(planeSize, planeSize)
    const planeMaterial = new THREE.MeshLambertMaterial({ map: texture })
    planeMaterial.color.setHSL(0.095, 1, 0.85)
    const plane = new THREE.Mesh(planeGeo, planeMaterial)
    plane.receiveShadow = true
    plane.position.y = 0
    plane.rotation.x = degreesToRadians(-90)
    scene.add(plane)
  }
}

class CollectionEntitiesCube extends Collection {
  private cube: THREE.Mesh
  constructor(scene: THREE.Scene) {
    super()
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshLambertMaterial({ color: new THREE.Color('#ff5858') })
    this.cube = new THREE.Mesh(geometry, material)
    this.cube.castShadow = true
    this.cube.position.y = 1.2
    scene.add(this.cube)
  }
  update(delta: number) {
    this.cube.rotation.x += 2 * delta
    this.cube.rotation.y += 2 * delta
  }
}
