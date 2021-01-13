export abstract class Phase<P extends string> {
  abstract async onEntry(fromPhase: P): Promise<P | undefined>
  abstract async onExit(toPhase: P): Promise<void>
}