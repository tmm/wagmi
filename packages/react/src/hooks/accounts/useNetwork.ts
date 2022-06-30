import { getNetwork, watchNetwork } from '@wagmi/core'

import { useSyncExternalStoreWithTracked } from '../utils'

export function useNetwork() {
  return useSyncExternalStoreWithTracked(watchNetwork, getNetwork, getNetwork)
}
