import * as React from 'react'
import { useNetwork, useSwitchNetwork } from 'wagmi'

export const NetworkSwitcher = () => {
  const { chain } = useNetwork()
  const { chains, error, pendingChainId, switchNetwork, status } =
    useSwitchNetwork()

  return (
    <div>
      {chain && <div>Using {chain.name}</div>}

      {/* {chains.map((x) => (
        <button
          disabled={!switchNetwork || x.id === chain?.id}
          key={x.id}
          onClick={() => switchNetwork?.(x.id)}
        >
          Switch to {x.name}
          {status === 'loading' && x.id === pendingChainId && '…'}
        </button>
      ))}

      <div>{error && (error?.message ?? 'Failed to switch')}</div> */}
    </div>
  )
}
