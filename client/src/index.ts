import { NetworkStateIO, NetworkStateIOConsole, NetworkStateIOAI } from './network-state-io'
import { NetworkActions } from './NetworkActions'
import { NetSyncClient } from 'net-sync'
import { NetMessage } from '@shared'
import * as _ from 'lodash'

const config = {
  isAI: _.includes(process.argv, '--ai'),
}

const networkState: any = {}
const netSyncClient = new NetSyncClient<NetMessage>(networkState, 'localhost', 8081)

const networkActions = new NetworkActions(netSyncClient)
const networkStateIO: NetworkStateIO = config.isAI
  ? new NetworkStateIOAI(networkState, networkActions)
  : new NetworkStateIOConsole(networkState, networkActions)

netSyncClient.on('message', message => networkStateIO.onMessage(message as any))
netSyncClient.on('connect', connection => networkStateIO.onConnect())
netSyncClient.on('disconnect', connection => networkStateIO.onDisconnect())