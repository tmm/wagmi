import * as React from 'react'
import { useNetwork, useSwitchNetwork } from 'wagmi'

import { useIsMounted } from '../hooks'

export const NetworkSwitcher = () => {
  const isMounted = useIsMounted()
  const { chain } = useNetwork()
  const { chains, error, pendingChainId, switchNetwork, status } =
    useSwitchNetwork()

  return (
    <div>
      {chain && <div>Using {chain.name}</div>}

      {(isMounted ? chains : []).map((x) => (
        <button
          disabled={!switchNetwork || x.id === chain?.id}
          key={x.id}
          onClick={() => switchNetwork?.(x.id)}
        >
          Switch to {x.name}
          {status === 'loading' && x.id === pendingChainId && '…'}
        </button>
      ))}

      <div>{error && (error?.message ?? 'Failed to switch')}</div>
    </div>
  )
}
