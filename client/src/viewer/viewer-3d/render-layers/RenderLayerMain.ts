import { RenderLayer, Collection } from '.'
import { degreesToRadians } from '../math'
import { NetworkState, NetworkStateEntity } from '@shared'
import { Assets } from '../Assets'
import { Input } from '../Input'
import * as THREE from 'three'
import * as _ from 'lodash'

export class RenderLayerMain extends RenderLayer {
  private readonly scene: THREE.Scene
  private readonly collectionLights: CollectionLightsDaylight
  private readonly collectionTerrain: CollectionTerrainFlatGrid
  private readonly collectionEntities: CollectionEntities
  private readonly collectionCamera: CollectionCamera
  private readonly collectionMouseInput: CollectionMouseInput
  constructor(renderer: THREE.WebGLRenderer, assets: Assets, input: Input) {
    super(renderer, assets, input)

    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2('#faf5ef', 0.015)
    this.scene.background = new THREE.Color('#faf5ef')

    this.collectionLights = new CollectionLightsDaylight(this.scene)
    this.collectionTerrain = new CollectionTerrainFlatGrid(this.scene, this.assets, this.renderer.capabilities.getMaxAnisotropy())
    this.collectionEntities = new CollectionEntities(this.scene)
    this.collectionCamera = new CollectionCamera(this.input)
    this.collectionMouseInput = new CollectionMouseInput(this.scene, this.input, this.collectionCamera.camera)
  }
  render(delta: number) {
    this.collectionCamera.update(delta)
    this.collectionEntities.update(delta)
    this.collectionMouseInput.update(delta)
    this.renderer.clearDepth()
    this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight)
    this.renderer.render(this.scene, this.collectionCamera.camera)
  }
  updateNetworkState(networkState: NetworkState) {
    this.collectionEntities.updateNetworkState(networkState)
  }
  getCamera(): THREE.Camera {
    return this.collectionCamera.camera
  }
}

class CollectionMouseInput extends Collection {
  private readonly scene: THREE.Scene
  private readonly input: Input
  private readonly camera: THREE.Camera
  private readonly raycaster: THREE.Raycaster
  constructor(scene: THREE.Scene, input: Input, camera: THREE.Camera) {
    super()
    this.scene = scene
    this.input = input
    this.camera = camera
    this.raycaster = new THREE.Raycaster()
  }
  update(delta: number) {
    this.raycaster.setFromCamera(this.input.getMousePosition(), this.camera)
    const intersects = this.raycaster.intersectObjects(this.scene.children)
    _.forEach(intersects, intersect => {
      if (intersect.object instanceof THREE.Mesh) {
        console.log(intersect.object.name)
      }
    })
  }
}

class CollectionCamera extends Collection {
  readonly camera: THREE.Camera
  private readonly cameraBaseSpeed: number = 10
  private readonly cameraZoomSpeedMultiplier: number = 2.4
  private readonly cameraZoomMin: number = 0
  private readonly cameraZoomMax: number = 8
  private readonly cameraBaseHeight: number = 6
  private readonly cameraBaseDip: number = 20
  private readonly cameraTargetTranslation: THREE.Vector3
  private readonly cameraTargetRotation: THREE.Euler
  private cameraZoom: number = 0
  private readonly input: Input
  constructor(input: Input) {
    super()
    this.input = input

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.z = 5
    this.camera.position.y = this.cameraBaseHeight

    this.cameraTargetTranslation = this.camera.position.clone()
    this.cameraTargetTranslation.z = 7
    this.cameraTargetRotation = this.camera.rotation.clone()
  }
  update(delta: number) {
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
  constructor(scene: THREE.Scene, assets: Assets, anisotropy: number) {
    super()
    const terrainSize = 1000
    const geometry = new THREE.PlaneBufferGeometry(terrainSize, terrainSize)
    const texture = assets.getTexture('grid1x1.png')
    texture.anisotropy = anisotropy
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(terrainSize, terrainSize)
    const material = new THREE.MeshLambertMaterial({ map: texture })
    material.color.setHSL(0.095, 1, 0.85)
    const plane = new THREE.Mesh(geometry, material)
    plane.name = 'TERRAIN'
    plane.receiveShadow = true
    plane.position.y = 0
    plane.rotation.x = degreesToRadians(-90)
    scene.add(plane)
  }
}

class AdvancedMesh {
  readonly mesh: THREE.Mesh
  private readonly targetPosition: THREE.Vector3 = new THREE.Vector3()
  constructor(mesh: THREE.Mesh) {
    this.mesh = mesh
  }
  update(delta: number) {
    this.mesh.position.x += (this.targetPosition.x - this.mesh.position.x) / 10
    this.mesh.position.z += (this.targetPosition.z - this.mesh.position.z) / 10
  }
  setTargetPosition(position: THREE.Vector3) {
    this.targetPosition.x = position.x
    this.targetPosition.z = position.y
  }
}

class CollectionEntities extends Collection {
  private readonly scene: THREE.Scene
  private readonly entityIdToMeshMap = new Map<number, AdvancedMesh>()
  constructor(scene: THREE.Scene) {
    super()
    this.scene = scene
  }
  private createMeshForEntity(entity: NetworkStateEntity) {
    const geometry = new THREE.BoxBufferGeometry()
    const material = new THREE.MeshLambertMaterial()
    const mesh = new THREE.Mesh(geometry, material)
    const advancedMesh = new AdvancedMesh(mesh)
    this.scene.add(mesh)
    this.entityIdToMeshMap.set(entity.id, advancedMesh)
  }
  private removeMeshForEntityId(entityId: number) {
    const advancedMesh = this.entityIdToMeshMap.get(entityId)
    if (!advancedMesh) return
    this.scene.remove(advancedMesh.mesh)
    this.entityIdToMeshMap.delete(entityId)
  }
  private updateDifference(networkStateEntities: NetworkStateEntity[]) {
    const currentEntityIds = Array.from(this.entityIdToMeshMap.keys())
    const createdEntitiesIds = _.difference(
      networkStateEntities.map(e => e.id),
      currentEntityIds,
    )
    const removedEntitiesIds = _.difference(
      currentEntityIds,
      networkStateEntities.map(e => e.id),
    )
    _.forEach(createdEntitiesIds, entityId => {
      const entity = networkStateEntities.find(entity => entity.id === entityId)
      if (!entity) return
      this.createMeshForEntity(entity)
    })
    _.forEach(removedEntitiesIds, entityId => {
      this.removeMeshForEntityId(entityId)
    })
  }
  private updatePositions(networkStateEntities: NetworkStateEntity[]) {
    _.forEach(networkStateEntities, entity => {
      const movementComponent = entity.components.find(component => component.type === 'MOVEMENT')
      if (!movementComponent) {
        console.warn('CollectionEntities cant find movement component')
        return
      }
      const advancedMesh = this.entityIdToMeshMap.get(entity.id)
      if(!advancedMesh) {
        console.warn('Entity mismatch between NetworkState and CollectionEntities')
        return
      }
      advancedMesh.setTargetPosition(movementComponent.position)
    })
  }
  updateNetworkState(networkState: NetworkState) {
    this.updateDifference(networkState.entities)
    this.updatePositions(networkState.entities)
  }
  update(delta: number) {
    const advancedMeshes = Array.from(this.entityIdToMeshMap.values())
    advancedMeshes.forEach(advancedMesh => advancedMesh.update(delta))
  }
}

// class CollectionEntitiesCube extends Collection {
//   private cube: THREE.Mesh
//   constructor(scene: THREE.Scene) {
//     super()
//     const geometry = new THREE.BoxGeometry()
//     const material = new THREE.MeshLambertMaterial({ color: new THREE.Color('#ff5858') })
//     this.cube = new THREE.Mesh(geometry, material)
//     this.cube.castShadow = true
//     this.cube.position.y = 1.2
//     scene.add(this.cube)
//   }
//   update(delta: number) {
//     this.cube.rotation.x += 2 * delta
//     this.cube.rotation.y += 2 * delta
//   }
// }
