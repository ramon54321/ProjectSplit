import { NetMessage } from '@shared'
import { NetworkStateIO } from '.'

export class NetworkStateIOConsole extends NetworkStateIO {
  async onConnect() {
    console.log('Connected Console')
  }
  async onDisconnect() {
    console.log('Disconnected Console')
  }
  async onMessage(message: NetMessage) {
    
  }
  async onTick(tick: number) {
    // Print state to console
    console.log(JSON.stringify(this.networkState, null, 2))
  }
}