import * as React from 'react'
import { useAccount, useConnect } from 'wagmi'

import { useIsMounted } from '../hooks'

export const Connect = () => {
  const isMounted = useIsMounted()
  const { connector, isReconnecting } = useAccount()
  const { connect, connectors, isLoading, error, pendingConnector } =
    useConnect()

  return (
    <div>
      <div>
        {connectors.map((x) => (
          <button
            disabled={
              isMounted &&
              (!x.ready || isReconnecting || connector?.id === x.id)
            }
            key={x.name}
            onClick={() => connect({ connector: x })}
          >
            {x.name}
            {isMounted && !x.ready && ' (unsupported)'}
            {isLoading && x.id === pendingConnector?.id && '…'}
          </button>
        ))}
      </div>

      <div>{error && error.message}</div>
    </div>
  )
}
