import { NetSyncServer, NetConnection } from 'net-sync'
import { NetMessage } from '@shared'

export class ClientManager {
  private readonly netSyncServer: NetSyncServer<NetMessage>
  private readonly clients: NetConnection[] = []

  constructor(netSyncServer: NetSyncServer<NetMessage>) {
    this.netSyncServer = netSyncServer
    this.netSyncServer.on('connect', netConnection => {
      this.clients.push(netConnection)
    })
    this.netSyncServer.on('disconnect', netConnection => {
      const indexToRemove = this.clients.findIndex(c => c.id === netConnection.id)
      this.clients.splice(indexToRemove, 1)
    })
  }

  getClientCount(): number {
    return this.clients.length
  }

  getClientIds(): string[] {
    return this.clients.map(c => c.id)
  }
}
