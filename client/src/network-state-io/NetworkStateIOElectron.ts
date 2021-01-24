import { NetMessage } from '@shared'
import { NetworkStateIO } from '.'
import { Viewer, Viewer3D } from '../viewer'

export class NetworkStateIOElectron extends NetworkStateIO {
  private readonly viewer: Viewer = new Viewer3D()
  init() {
    
  }
  async onConnect() {
    console.log('Connected Electron')
  }
  async onDisconnect() {
    console.log('Disconnected Electron')
  }
  async onMessage(message: NetMessage) {
    
  }
  async onTick(tick: number) {
    this.viewer.updateNetworkState(this.networkState)
  }
}