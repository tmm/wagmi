import * as React from 'react'
import { GetAccountResult, getAccount, watchAccount } from '@wagmi/core'

import { useClient } from '../../context'
import { useSyncExternalStoreWithTracked } from '../utils'

export type UseAccountConfig = {
  /** Function to invoke when connected */
  onConnect?({
    address,
    connector,
    isReconnected,
  }: {
    address?: GetAccountResult['address']
    connector?: GetAccountResult['connector']
    isReconnected: boolean
  }): void
  /** Function to invoke when disconnected */
  onDisconnect?(): void
}

export function useAccount({ onConnect, onDisconnect }: UseAccountConfig = {}) {
  const account = useSyncExternalStoreWithTracked(
    watchAccount,
    getAccount,
    getAccount,
  )

  const { subscribe } = useClient()

  React.useEffect(() => {
    // No need to subscribe if these callbacks aren't defined
    if (!onConnect && !onDisconnect) return

    // Trigger update when status changes
    const unsubscribe = subscribe(
      (state) => state.status,
      (status, prevStatus) => {
        if (!!onConnect && status === 'connected') {
          const { address, connector } = getAccount()
          onConnect({
            address,
            connector,
            isReconnected: prevStatus === 'reconnecting',
          })
        }

        if (
          !!onDisconnect &&
          prevStatus !== 'connecting' &&
          status === 'disconnected'
        )
          onDisconnect()
      },
    )
    return unsubscribe
  }, [onConnect, onDisconnect, subscribe])

  return account
}
