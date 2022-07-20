import shallow from 'zustand/shallow'

import { getClient } from '../../client'
import { Chain } from '../../types'
import { GetNetworkResult, getNetwork } from './getNetwork'

export type WatchNetworkCallback = (data: GetNetworkResult) => void

export type WatchNetworkConfig = {
  selector?({ chainId, chains }: { chainId?: number; chains?: Chain[] }): any
}

export function watchNetwork(
  callback: WatchNetworkCallback,
  { selector = (x) => x }: WatchNetworkConfig = {},
) {
  const client = getClient()
  const handleChange = () => callback(getNetwork())
  const unsubscribe = client.subscribe(
    ({ data, connector }) =>
      selector({ chainId: data?.chain?.id, chains: connector?.chains }),
    handleChange,
    {
      equalityFn: shallow,
    },
  )
  return unsubscribe
}
