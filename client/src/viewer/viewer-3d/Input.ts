export class Input {
  readonly keyDownMap: { [key: string]: boolean } = {}
  constructor() {
    document.onkeydown = (e: KeyboardEvent) => (this.keyDownMap[e.key] = true)
    document.onkeyup = (e: KeyboardEvent) => (this.keyDownMap[e.key] = false)
  }
}