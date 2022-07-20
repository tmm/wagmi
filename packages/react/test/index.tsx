import * as React from 'react'
import {
  RenderHookOptions,
  renderHook as defaultRenderHook,
  waitFor,
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { QueryClient } from 'react-query'

import { WagmiConfig } from '../src'
import { Client } from '../src/types'
import { setupClient } from './utils'
import { reactVersion } from './setup'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevent Jest from garbage collecting cache
      cacheTime: Infinity,
      // Turn off retries to prevent timeouts
      retry: false,
    },
  },
  logger: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    error: () => {},
    log: console.log,
    warn: console.warn,
  },
})

type Props = { client?: Client } & {
  children?:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactNode
}
export function wrapper(props: Props) {
  const client = props.client ?? setupClient({ queryClient })
  return <WagmiConfig client={client} {...props} />
}

export function renderHook<TResult, TProps>(
  hook: (props: TProps) => TResult,
  {
    wrapper: wrapper_,
    ...options_
  }: RenderHookOptions<TProps & { client?: Client }> | undefined = {},
) {
  let options: RenderHookOptions<TProps & { client?: Client }>
  if (reactVersion === '18')
    options = {
      wrapper: (props) => wrapper({ ...props, ...options_?.initialProps }),
      ...options_,
    }
  else
    options = {
      wrapper: wrapper_ ?? wrapper,
      ...options_,
    }

  queryClient.clear()

  const utils = defaultRenderHook<TResult, TProps>(hook, options)
  return {
    ...utils,
    waitFor: (utils as { waitFor?: typeof waitFor }).waitFor ?? waitFor,
  }
}

export { act } from '@testing-library/react'
export {
  setupClient,
  actConnect,
  actDisconnect,
  actSwitchNetwork,
  getUnclaimedTokenId,
  useAccount,
  useNetwork,
} from './utils'
export {
  getProvider,
  getWebSocketProvider,
  getSigners,
  wagmigotchiContractConfig,
  mlootContractConfig,
} from '../../core/test'
