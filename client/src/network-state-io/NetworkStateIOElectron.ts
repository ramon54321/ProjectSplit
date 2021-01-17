import { NetMessage } from '@shared'
import { NetworkStateIO } from '.'

export class NetworkStateIOElectron extends NetworkStateIO {
  async onConnect() {
    console.log('Connected Electron')
  }
  async onDisconnect() {
    console.log('Disconnected Electron')
  }
  async onMessage(message: NetMessage) {
    
  }
  async onTick(tick: number) {
    // Print state to console
    console.log(JSON.stringify(this.networkState, null, 2))
  }
}