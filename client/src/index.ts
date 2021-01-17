import { NetworkStateIOElectron } from './network-state-io/NetworkStateIOElectron'
import { NetworkStateIOConsole } from './network-state-io'
import { AIBasic, AINull } from './ai'
import { InitType } from '@shared'
import * as yargs from 'yargs'
import { Init } from './Init'

const argv = yargs
  .option('ai', {
    boolean: true,
  })
  .option('electron', {
    boolean: true,
  })
  .help()
  .alias('help', 'h').argv

const AIClass = argv.ai ? AIBasic : AINull
const initType: InitType = argv.electron ? 'ELECTRON' : 'CONSOLE'

if (initType === 'CONSOLE') {
  new Init('localhost', 8081, NetworkStateIOConsole, AIClass)
} else if (initType === 'ELECTRON') {
  new Init('localhost', 8081, NetworkStateIOElectron, AIClass)
} else {
  throw new Error(`Failed to initialize ${initType}`)
}
