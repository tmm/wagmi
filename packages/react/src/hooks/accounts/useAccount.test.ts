import { connect } from '@wagmi/core'

import {
  actHookConnect,
  actHookDisconnect,
  renderHook,
  setupWagmiClient,
  wrapper,
} from '../../../test'
import { UseAccountConfig, useAccount } from './useAccount'
import { useConnect } from './useConnect'
import { useDisconnect } from './useDisconnect'

const useAccountWithConnectAndDisconnect = (
  config: { account?: UseAccountConfig } = {},
) => {
  const account = useAccount(config.account)
  const connect = useConnect()
  const disconnect = useDisconnect()
  return { account, connect, disconnect } as const
}

describe('useAccount', () => {
  describe('mounts', () => {
    it('is connected', async () => {
      const client = setupWagmiClient()
      await connect({ connector: client.connectors[0] })

      const { result, waitFor } = renderHook(() => useAccount(), {
        wrapper,
        initialProps: { client },
      })

      await waitFor(() => result.current.isSuccess)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { internal, ...res } = result.current
      expect(res).toMatchInlineSnapshot(`
        {
          "data": {
            "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            "connector": "<MockConnector>",
          },
          "error": null,
          "fetchStatus": "idle",
          "isError": false,
          "isFetched": true,
          "isFetching": false,
          "isIdle": false,
          "isLoading": false,
          "isRefetching": false,
          "isSuccess": true,
          "refetch": [Function],
          "status": "success",
        }
      `)
    })

    it('is not connected', async () => {
      const { result, waitFor } = renderHook(() => useAccount())

      await waitFor(() => result.current.isSuccess)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { internal, ...res } = result.current
      expect(res).toMatchInlineSnapshot(`
        {
          "data": null,
          "error": null,
          "fetchStatus": "idle",
          "isError": false,
          "isFetched": true,
          "isFetching": false,
          "isIdle": false,
          "isLoading": false,
          "isRefetching": false,
          "isSuccess": true,
          "refetch": [Function],
          "status": "success",
        }
      `)
    })
  })

  describe('behavior', () => {
    it('updates on connect and disconnect', async () => {
      const utils = renderHook(() => useAccountWithConnectAndDisconnect())
      const { result, waitFor } = utils

      await actHookConnect({ utils })

      await waitFor(() => result.current.account.isSuccess)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { internal, ...res } = result.current.account
      expect(res).toMatchInlineSnapshot(`
        {
          "data": {
            "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            "connector": "<MockConnector>",
          },
          "error": null,
          "fetchStatus": "idle",
          "isError": false,
          "isFetched": true,
          "isFetching": false,
          "isIdle": false,
          "isLoading": false,
          "isRefetching": false,
          "isSuccess": true,
          "refetch": [Function],
          "status": "success",
        }
      `)

      await actHookDisconnect({ utils })

      await waitFor(() => result.current.account.isSuccess)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { internal: _, ...res2 } = result.current.account
      expect(res2).toMatchInlineSnapshot(`
        {
          "data": null,
          "error": null,
          "fetchStatus": "idle",
          "isError": false,
          "isFetched": true,
          "isFetching": false,
          "isIdle": false,
          "isLoading": false,
          "isRefetching": false,
          "isSuccess": true,
          "refetch": [Function],
          "status": "success",
        }
      `)
    })
  })
})
