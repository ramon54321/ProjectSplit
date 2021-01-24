import { NetworkState } from '@shared'

export abstract class Viewer {
  abstract updateNetworkState(networkState: NetworkState): void
}

import { Viewer3D } from './viewer-3d'

export { Viewer3D }
