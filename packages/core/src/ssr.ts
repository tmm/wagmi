import jsCookie from 'js-cookie'

import { Client, getClient } from './client'
import { BaseStorage } from './storage'
import { SSRData } from './types'

export let ssrData: SSRData = { cookies: {} }
export function initializeSsr(ssrData_: SSRData) {
  ssrData = ssrData_

  const client = getClient()
  const initialAccount =
    client.ssrStorage?.getItem<string>('account') || undefined
  const initialConnectors =
    client.ssrStorage?.getItem<Client['connectors']>('connectors') || []
  const initialChainId =
    client.ssrStorage?.getItem<number>('chainId') || undefined
  const initialStatus =
    client.ssrStorage?.getItem<Client['status']>('status') || 'disconnected'

  client.setState((x) => ({
    ...x,
    connectors: initialConnectors,
    data: {
      account: initialAccount,
      chain: initialChainId
        ? {
            id: initialChainId,
            unsupported: false,
          }
        : undefined,
    },
    status: initialStatus === 'connected' ? 'reconnecting' : initialStatus,
  }))
}

export const ssrStorage: BaseStorage = {
  getItem: (key) => {
    const value = jsCookie.get(key) || ssrData.cookies[key] || null
    return value
  },
  setItem: (key, value) => jsCookie.set(key, value),
  removeItem: jsCookie.remove,
}
