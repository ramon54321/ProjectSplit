import { NetMessage } from '@shared'
import { NetworkStateIO } from '.'

export class NetworkStateIOConsole extends NetworkStateIO {
  async onConnect() {
    throw new Error("Method not implemented.")
  }
  async onDisconnect() {
    throw new Error("Method not implemented.")
  }
  async onMessage(message: NetMessage) {
    console.log(JSON.stringify(this.networkState, null, 2))
  }
}