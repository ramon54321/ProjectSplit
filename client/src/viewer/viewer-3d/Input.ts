import * as THREE from 'three'

export class Input {
  readonly keyDownMap: { [key: string]: boolean } = {}
  private readonly mousePosition: THREE.Vector2 = new THREE.Vector2()
  constructor() {
    document.onkeydown = (e: KeyboardEvent) => (this.keyDownMap[e.key] = true)
    document.onkeyup = (e: KeyboardEvent) => (this.keyDownMap[e.key] = false)
    document.onmousemove = (e: MouseEvent) => {
      this.mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1
      this.mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
  }
  getMousePosition(): THREE.Vector2 {
    return this.mousePosition.clone()
  }
}
