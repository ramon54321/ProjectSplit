import { Phase } from './Phase'

export class PhaseMachine<P extends string> {
  private currentPhase: P | undefined
  private phaseMap: {[K in P]: Phase<P>}
  constructor(phaseMap: {[K in P]: Phase<P>}) {
    this.phaseMap = phaseMap
  }
  async start(phase: P) {
    this.currentPhase = phase
    let nextPhase = await this.enterPhase(this.currentPhase, this.currentPhase)
    while(nextPhase) {
      await this.exitPhase(this.currentPhase, nextPhase)
      this.currentPhase = nextPhase
      nextPhase = await this.enterPhase(nextPhase, this.currentPhase)
    }
    await this.exitPhase(this.currentPhase, this.currentPhase)
  }
  private async enterPhase(toPhase: P, fromPhase: P): Promise<P | undefined> {
    return await this.phaseMap[toPhase].onEntry(fromPhase)
  }
  private async exitPhase(fromPhase: P, toPhase: P) {
    await this.phaseMap[fromPhase].onExit(toPhase)
  }
  getPhaseTag(): P | undefined {
    return this.currentPhase
  }
}