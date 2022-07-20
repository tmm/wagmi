import * as React from 'react'
import { Provider, WebSocketProvider } from '@wagmi/core'
import {
  DehydratedState as DehydratedQueryState,
  dehydrate as dehydrateQueryClient,
  hydrate as hydrateQueryClient,
} from 'react-query'

import { Client } from './types'
import { useClient } from './context'

type SSRData = {
  account: string | null
  chain: { id: number; unsupported: boolean } | null
}

export function extractState<
  TProvider extends Provider = Provider,
  TWebSocketProvider extends WebSocketProvider = WebSocketProvider,
>(
  client: Client<TProvider, TWebSocketProvider>,
  req: any | null | undefined,
): SSRData {
  try {
    const cookies = req?.cookies
    const store = client.storage.deserialize(
      cookies[client.storage.getKey('store')],
    )
    return store.state.data
  } catch (error) {
    return {
      account: null,
      chain: null,
    }
  }
}

export type DehydratedState = {
  data: SSRData | null
  queryState: DehydratedQueryState
}

export function dehydrate<
  TProvider extends Provider = Provider,
  TWebSocketProvider extends WebSocketProvider = WebSocketProvider,
>(
  client: Client<TProvider, TWebSocketProvider>,
  ssrData: SSRData | null = null,
): DehydratedState {
  const queryState = dehydrateQueryClient(client.queryClient)
  return {
    data: ssrData,
    queryState,
  }
}

export function hydrate<
  TProvider extends Provider = Provider,
  TWebSocketProvider extends WebSocketProvider = WebSocketProvider,
>(client: Client<TProvider, TWebSocketProvider>, dehydratedState: unknown) {
  const { data, queryState } = <DehydratedState>dehydratedState ?? {}
  const account = data?.account ?? undefined
  const chain = data?.chain ?? undefined

  // Hydrate query client
  hydrateQueryClient(client.queryClient, queryState)

  // Restore client state
  client.setState((x) => ({
    ...x,
    data: {
      ...x.data,
      account,
      chain,
    },
    status: account ? 'reconnecting' : x.status,
  }))
}

export type UseHydrateConfig = {
  state: unknown
}

export function useHydrate({ state }: UseHydrateConfig) {
  const client = useClient()

  // hydrate can and should be run *during* render here for SSR to work properly
  React.useMemo(() => {
    if (state) hydrate(client, state)
  }, [client, state])
}

export type HydrateProps = {
  state?: unknown
}

export function Hydrate({
  children,
  state,
}: React.PropsWithChildren<HydrateProps>) {
  useHydrate({ state })

  return children as React.ReactElement
}
