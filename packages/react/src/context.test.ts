import * as React from 'react'

import { renderHook, wrapper } from '../test'
import { useClient } from './context'

describe.skip('useContext', () => {
  it('should throw when not inside Provider', () => {
    const wrapper = ({ children }: { children: React.ReactElement }) =>
      React.createElement('div', { children })
    const { result } = renderHook(() => useClient(), { wrapper })
    expect(() => result.current).toThrowErrorMatchingInlineSnapshot(
      `"Must be used within WagmiProvider"`,
    )
  })

  it('inits', () => {
    const { result } = renderHook(() => useClient())
    const state = result.current.state
    const { connectors, provider, ...rest } = state
    expect(rest).toMatchInlineSnapshot(`
      {
        "cacheBuster": 1,
        "connecting": false,
        "connector": undefined,
        "data": undefined,
        "webSocketProvider": undefined,
      }
    `)
    expect(connectors).toBeDefined()
    expect(provider).toBeDefined()
  })

  it('autoConnect', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useClient(), {
      wrapper,
      initialProps: {
        autoConnect: true,
      },
    })
    expect(result.current.state.connecting).toMatchInlineSnapshot(`true`)
    await waitForNextUpdate()
    expect(result.current.state.connecting).toMatchInlineSnapshot(`false`)
  })
})
