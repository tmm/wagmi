import { getClient } from '../../client'
import { Chain } from '../../types'

export type GetNetworkResult = {
  chain?: Chain & {
    unsupported?: boolean
  }
  chains: Chain[]
}

export function getNetwork(): GetNetworkResult {
  const client = getClient()

  const chainId = client.data?.chain?.id
  const activeChains = client.connector?.chains ?? []
  const activeChain = [...(client.provider.chains || []), ...activeChains].find(
    (x) => x.id === chainId,
  ) ?? {
    id: chainId,
    name: `Chain ${chainId}`,
    network: `${chainId}`,
    rpcUrls: { default: '' },
  }

  return {
    chain: chainId
      ? {
          ...activeChain,
          ...client.data?.chain,
          id: chainId,
        }
      : undefined,
    chains: activeChains,
  } as const
}
