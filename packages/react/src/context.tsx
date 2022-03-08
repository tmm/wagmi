import * as React from 'react'
import { WagmiClient, createWagmiClient } from '@wagmi/core'
import {
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { persistQueryClient } from 'react-query/persistQueryClient-experimental'
import { createWebStoragePersistor } from 'react-query/createWebStoragePersistor-experimental'

export const Context = React.createContext<WagmiClient | undefined>(undefined)

export type Props = {
  /**
   * WagmiClient instance
   * @default new WagmiClient()
   */
  client?: WagmiClient
  /**
   * react-query instance
   * @default new QueryClient()
   */
  queryClient?: QueryClient
}

const defaultQueryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 60 * 24,
      retry: 0,
    },
  },
}

export const Provider = ({
  children,
  client = createWagmiClient(),
  queryClient = new QueryClient(defaultQueryClientConfig),
}: React.PropsWithChildren<Props>) => {
  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    const localStoragePersistor = createWebStoragePersistor({
      storage: (client.storage as Storage) || window.localStorage,
    })

    persistQueryClient({
      queryClient,
      persistor: localStoragePersistor,
    })

    // Attempt to connect on mount
    ;(async () => {
      if (!client.config.autoConnect) return
      await client.autoConnect()
    })()

    return () => {
      client.destroy()
    }
  }, [])
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <Context.Provider value={client}>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* Automatically removed during production builds */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Context.Provider>
  )
}

export const useClient = () => {
  const client = React.useContext(Context)
  if (!client) throw Error('Must be used within WagmiProvider')
  return client
}
