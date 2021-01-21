export abstract class Phase<P extends string> {
  abstract onEntry(fromPhase: P): Promise<P | undefined>
  abstract onExit(toPhase: P): Promise<void>
}