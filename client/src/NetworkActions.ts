import { NetSyncClient } from 'net-sync'
import { NetMessage } from '@shared'

export class NetworkActions {
  private readonly netSyncClient: NetSyncClient<NetMessage>
  constructor(netSyncClient: NetSyncClient<NetMessage>) {
    this.netSyncClient = netSyncClient
  }
  setDeployReady() {
    this.netSyncClient.sendMessage({
      type: 'SET_DEPLOY_READY',
      isReady: true,
    })
  }
  setSpawnPosition(x: number, y: number) {
    this.netSyncClient.sendMessage({
      type: 'SET_SPAWN_POSITION',
      position: {
        x: x,
        y: y,
      },
    })
  }
}