import { PhaseMachine, PhaseLobby, PhaseDeploy, PhasePlay } from './phases'
import { NetMessage, GamePhase } from '@shared'
import { ClientManager } from './ClientManager'
import { ServerState } from './ServerState'
import { NetSyncServer } from 'net-sync'

// Networking
const networkState = {} as any
const netSyncServer = new NetSyncServer<NetMessage>(networkState, 8081)

// State
const serverState = new ServerState(netSyncServer, networkState)
const clientManager = new ClientManager(netSyncServer)

// Game Phases
const phaseMachine = new PhaseMachine<GamePhase>({
  LOBBY: new PhaseLobby('LOBBY', netSyncServer, serverState, clientManager),
  DEPLOY: new PhaseDeploy('DEPLOY', netSyncServer, serverState),
  PLAY: new PhasePlay('PLAY', netSyncServer, serverState),
})
phaseMachine.start('LOBBY')