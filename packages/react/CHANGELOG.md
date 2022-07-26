# wagmi

## 0.6.0

### Minor Changes

- [#658](https://github.com/wagmi-dev/wagmi/pull/658) [`d70c115`](https://github.com/wagmi-dev/wagmi/commit/d70c115131f299fb61f87867b6ac4218e0bcf432) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** The `useSendTransaction` hook's `data` now returns an object only consisting of `hash` & `wait`, and not the full [`TransactionResponse`](https://docs.ethers.io/v5/api/providers/types/#providers-TransactionResponse).

  If you require the full `TransactionResponse`, you can use `useTransaction`:

  ```diff
  import { useSendTransaction, useTransaction } from 'wagmi'

  const {
    data: {
      hash,
      wait,
  -   ...transaction
    }
  } = useSendTransaction(...)

  +const { data: transaction } = useTransaction({ hash })
  ```

  > Why? The old implementation of `useSendTransaction` created a long-running async task, causing [UX pitfalls](https://wagmi.sh/docs/prepare-hooks/intro#ux-pitfalls-without-prepare-hooks) when invoked in a click handler.

* [#658](https://github.com/wagmi-dev/wagmi/pull/658) [`d70c115`](https://github.com/wagmi-dev/wagmi/commit/d70c115131f299fb61f87867b6ac4218e0bcf432) Thanks [@jxom](https://github.com/jxom)! - **Breaking**: The configuration passed to the `useSendTransaction` hook now needs to be either:

  - prepared with the `usePrepareSendTransaction` hook **(new)**, or
  - recklessly unprepared **(previous functionality)**

  > Why? [Read here](https://wagmi.sh/docs/prepare-hooks/intro)

  ### Prepared usage

  ```diff
  import { usePrepareSendTransaction, useSendTransaction } from 'wagmi'

  +const { config } = usePrepareSendTransaction({
  +  request: {
  +    to: 'moxey.eth',
  +    value: parseEther('1'),
  +  }
  +})

  const { data } = useSendTransaction({
  - request: {
  -   to: 'moxey.eth',
  -   value: parseEther('1')
  - }
  + ...config
  })
  ```

  ### Recklessly unprepared usage

  If you are not ready to upgrade to `usePrepareSendTransaction`, it is possible to use `useSendTransaction` without preparing the configuration first by passing `mode: 'recklesslyUnprepared'`.

  ```diff
  import { useSendTransaction } from 'wagmi'

  const { data } = useSendTransaction({
  + mode: 'recklesslyUnprepared',
    request: {
      to: 'moxey.eth',
      value: parseEther('1'),
    }
  })
  ```

- [#658](https://github.com/wagmi-dev/wagmi/pull/658) [`d70c115`](https://github.com/wagmi-dev/wagmi/commit/d70c115131f299fb61f87867b6ac4218e0bcf432) Thanks [@jxom](https://github.com/jxom)! - **Breaking**: If a `chainId` is passed to `useContractWrite` or `useSendTransaction`, it will no longer attempt to switch chain before sending the transaction. Instead, it will throw an error if the user is on the wrong chain.

  > Why? Eagerly prompting to switch chain in these actions created a long-running async task that that makes [iOS App Links](https://wagmi.sh/docs/prepare-hooks/intro#ios-app-link-constraints) vulnerable.

* [#760](https://github.com/wagmi-dev/wagmi/pull/760) [`d8af6bf`](https://github.com/wagmi-dev/wagmi/commit/d8af6bf50885aec110ae4d64716642453aa27896) Thanks [@tmm](https://github.com/tmm)! - **Breaking:** `alchemyProvider` and `infuraProvider` now use a generic `apiKey` configuration option instead of `alchemyId` and `infuraId`.

  ```diff
  import { alchemyProvider } from '@wagmi/core/providers/alchemy'
  import { infuraProvider } from '@wagmi/core/providers/infura'

  alchemyProvider({
  -  alchemyId: 'yourAlchemyApiKey',
  +  apiKey: 'yourAlchemyApiKey',
  })

  infuraProvider({
  -  infuraId: 'yourInfuraApiKey',
  +  apiKey: 'yourInfuraApiKey',
  })
  ```

- [#658](https://github.com/wagmi-dev/wagmi/pull/658) [`d70c115`](https://github.com/wagmi-dev/wagmi/commit/d70c115131f299fb61f87867b6ac4218e0bcf432) Thanks [@jxom](https://github.com/jxom)! - Added the `usePrepareContractWrite` hook that eagerly fetches the parameters required for sending a contract write transaction such as the gas estimate.

  It returns config to be passed through to `useContractWrite`.

  ```ts
  const { config } = usePrepareContractWrite({
    addressOrName: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
    contractInterface: wagmigotchiABI,
    functionName: 'feed',
  })
  const { write } = useContractWrite(config)
  ```

* [#658](https://github.com/wagmi-dev/wagmi/pull/658) [`d70c115`](https://github.com/wagmi-dev/wagmi/commit/d70c115131f299fb61f87867b6ac4218e0bcf432) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** When `useSendTransaction` is in "prepare mode" (used with `usePrepareSendTransaction`), `sendTransaction`/`sendTransactionAsync` will be `undefined` until the configuration has been prepared. Ensure that your usage reflects this.

  ```tsx
  const { config } = usePrepareSendTransaction({ ... })
  const { sendTransaction } = useSendTransaction(config)

  <button
    disabled={!sendTransaction}
    onClick={() => sendTransaction?.()}
  >
    Send
  </button>
  ```

- [#658](https://github.com/wagmi-dev/wagmi/pull/658) [`d70c115`](https://github.com/wagmi-dev/wagmi/commit/d70c115131f299fb61f87867b6ac4218e0bcf432) Thanks [@jxom](https://github.com/jxom)! - Added the `usePrepareSendTransaction` hook that eagerly fetches the parameters required for sending a transaction such as the gas estimate and resolving an ENS address (if required).

  It returns config to be passed through to `useSendTransaction`.

  ```ts
  import { usePrepareSendTransaction, useSendTransaction } from '@wagmi/core'

  const { config } = usePrepareSendTransaction({
    request: {
      to: 'moxey.eth',
      value: parseEther('1'),
    },
  })
  const { sendTransaction } = useSendTransaction(config)
  ```

* [#658](https://github.com/wagmi-dev/wagmi/pull/658) [`d70c115`](https://github.com/wagmi-dev/wagmi/commit/d70c115131f299fb61f87867b6ac4218e0bcf432) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** The `sendTransaction`/`sendTransactionAsync` configuration object has now been altered to only accept "reckless" configuration. If one or more of these values are set, it can lead to [UX pitfalls](https://wagmi.sh/docs/prepare-hooks/intro#ux-pitfalls-without-prepare-hooks).

  ```diff
  <button
    onClick={() => {
      sendTransaction({
  -     request: {
  +     recklesslySetUnpreparedRequest:
          to: 'moxey.eth',
          value: parseEther('1')
        }
      })
    }}
  >
    Send
  </button>
  ```

- [#727](https://github.com/wagmi-dev/wagmi/pull/727) [`ac3b9b8`](https://github.com/wagmi-dev/wagmi/commit/ac3b9b87f80cb45b65d003f09d916d7d1427a62e) Thanks [@tmm](https://github.com/tmm)! - **Breaking**: Moved the `pollingInterval` config option from the chain provider config to `configureChains` config.

  ```diff
  const { chains, provider } = configureChains(
    [chain.mainnet, chain.polygon],
    [
  -   alchemyProvider({ apiKey, pollingInterval: 5000 }),
  -   publicProvider({ pollingInterval: 5000 })
  +   alchemyProvider({ apiKey }),
  +   publicProvider()
    ],
  + { pollingInterval: 5000 }
  )
  ```

* [#658](https://github.com/wagmi-dev/wagmi/pull/658) [`d70c115`](https://github.com/wagmi-dev/wagmi/commit/d70c115131f299fb61f87867b6ac4218e0bcf432) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** When `useContractWrite` is in "prepare mode" (used with `usePrepareContractWrite`), `write`/`writeAsync` will be `undefined` until the configuration has been prepared. Ensure that your usage reflects this.

  ```tsx
  const { config } = usePrepareContractWrite({ ... })
  const { write } = useContractWrite(config)

  <button
    disabled={!write}
    onClick={() => write?.()}
  >
    Send
  </button>
  ```

- [#658](https://github.com/wagmi-dev/wagmi/pull/658) [`d70c115`](https://github.com/wagmi-dev/wagmi/commit/d70c115131f299fb61f87867b6ac4218e0bcf432) Thanks [@jxom](https://github.com/jxom)! - **Breaking**: The configuration passed to the `useContractWrite` hook now needs to be either:

  - prepared with the `usePrepareContractWrite` hook **(new)**, or
  - recklessly unprepared **(previous functionality)**

  > Why? [Read here](https://wagmi.sh/docs/prepare-hooks/intro)

  ### Prepared usage

  ```diff
  import { usePrepareContractWrite, useContractWrite } from 'wagmi'

  +const { config } = usePrepareContractWrite({
  + addressOrName: '0x...',
  + contractInterface: wagmiAbi,
  + functionName: 'mint',
  + args: [tokenId]
  +})

  const { data } = useContractWrite({
  - addressOrName: '0x...',
  - contractInterface: wagmiAbi,
  - functionName: 'mint',
  - args: [tokenId],
  + ...config
  })
  ```

  ### Recklessly unprepared usage

  If you are not ready to upgrade to `usePrepareContractWrite`, it is possible to use `useContractWrite` without preparing the configuration first by passing `mode: 'recklesslyUnprepared'`.

  ```diff
  import { useContractWrite } from 'wagmi'

  const { data } = useContractWrite({
  + mode: 'recklesslyUnprepared',
    addressOrName: '0x...',
    contractInterface: wagmiAbi,
    functionName: 'mint',
    args: [tokenId],
  })
  ```

### Patch Changes

- [#733](https://github.com/wagmi-dev/wagmi/pull/733) [`6232487`](https://github.com/wagmi-dev/wagmi/commit/623248703bc728d539e28bf8a89b8ab22f0a5703) Thanks [@tmm](https://github.com/tmm)! - Add mock connector entrypoint

* [#762](https://github.com/wagmi-dev/wagmi/pull/762) [`ccaeed5`](https://github.com/wagmi-dev/wagmi/commit/ccaeed53d731f51879e0cdd5648797a32f7d7a31) Thanks [@jxom](https://github.com/jxom)! - Fix `useContractRead` return value unexpectedly returning null for falsy values

- [#734](https://github.com/wagmi-dev/wagmi/pull/734) [`7c2fa04`](https://github.com/wagmi-dev/wagmi/commit/7c2fa04e9b695840d6fa088e1f8d069f3c916551) Thanks [@jxom](https://github.com/jxom)! - Fix issue where `useProvider` & `useWebSocketProvider` would not update when `chainId` config changes

* [#739](https://github.com/wagmi-dev/wagmi/pull/739) [`c2295a5`](https://github.com/wagmi-dev/wagmi/commit/c2295a56cc86d02cc6602e2b4557b8ab9a091a3f) Thanks [@tmm](https://github.com/tmm)! - Fix balance formatting for tokens that do not have 18 decimals.

- [#759](https://github.com/wagmi-dev/wagmi/pull/759) [`959953d`](https://github.com/wagmi-dev/wagmi/commit/959953d1f5b3e8189bac56de245c62333470d18e) Thanks [@tmm](https://github.com/tmm)! - Added `useTransaction` hook:

  ```ts
  import { useTransaction } from 'wagmi'

  const result = useTransaction({
    hash: '0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060',
  })
  ```

- Updated dependencies [[`d70c115`](https://github.com/wagmi-dev/wagmi/commit/d70c115131f299fb61f87867b6ac4218e0bcf432), [`d70c115`](https://github.com/wagmi-dev/wagmi/commit/d70c115131f299fb61f87867b6ac4218e0bcf432), [`d70c115`](https://github.com/wagmi-dev/wagmi/commit/d70c115131f299fb61f87867b6ac4218e0bcf432), [`d8af6bf`](https://github.com/wagmi-dev/wagmi/commit/d8af6bf50885aec110ae4d64716642453aa27896), [`d70c115`](https://github.com/wagmi-dev/wagmi/commit/d70c115131f299fb61f87867b6ac4218e0bcf432), [`c2295a5`](https://github.com/wagmi-dev/wagmi/commit/c2295a56cc86d02cc6602e2b4557b8ab9a091a3f), [`ac3b9b8`](https://github.com/wagmi-dev/wagmi/commit/ac3b9b87f80cb45b65d003f09d916d7d1427a62e), [`d70c115`](https://github.com/wagmi-dev/wagmi/commit/d70c115131f299fb61f87867b6ac4218e0bcf432), [`d70c115`](https://github.com/wagmi-dev/wagmi/commit/d70c115131f299fb61f87867b6ac4218e0bcf432), [`959953d`](https://github.com/wagmi-dev/wagmi/commit/959953d1f5b3e8189bac56de245c62333470d18e)]:
  - @wagmi/core@0.5.0

## 0.5.11

### Patch Changes

- [`4c7d123`](https://github.com/wagmi-dev/wagmi/commit/4c7d123c8e74f93e770096857eb8c40ce0a47681) Thanks [@jxom](https://github.com/jxom)! - Fix issue where `useProvider` & `useWebSocketProvider` would not update when `chainId` config changes

## 0.5.10

### Patch Changes

- [#713](https://github.com/tmm/wagmi/pull/713) [`08b0113`](https://github.com/tmm/wagmi/commit/08b0113bef9f32dceab2ecd823b1ee00f9bdc45d) Thanks [@jxom](https://github.com/jxom)! - Fix an issue where the `useContractRead` query function could return `undefined` instead of a serializable `null`.

* [#725](https://github.com/tmm/wagmi/pull/725) [`b976920`](https://github.com/tmm/wagmi/commit/b97692051d778d7e112872663832c97963a8029a) Thanks [@tmm](https://github.com/tmm)! - Lock `react-query` version

- [#721](https://github.com/tmm/wagmi/pull/721) [`abea25f`](https://github.com/tmm/wagmi/commit/abea25fd15d81d1ecaec9d3fbd687042ab29b1e6) Thanks [@tmm](https://github.com/tmm)! - Add `name` to `useToken` `data` value.

- Updated dependencies [[`abea25f`](https://github.com/tmm/wagmi/commit/abea25fd15d81d1ecaec9d3fbd687042ab29b1e6), [`abea25f`](https://github.com/tmm/wagmi/commit/abea25fd15d81d1ecaec9d3fbd687042ab29b1e6)]:
  - @wagmi/core@0.4.9

## 0.5.9

### Patch Changes

- [#677](https://github.com/tmm/wagmi/pull/677) [`35e4219`](https://github.com/tmm/wagmi/commit/35e42199af9dd346549c1718e144728f55b8d7dd) Thanks [@jxom](https://github.com/jxom)! - Move `parseContractResult` to `@wagmi/core`

* [#677](https://github.com/tmm/wagmi/pull/677) [`35e4219`](https://github.com/tmm/wagmi/commit/35e42199af9dd346549c1718e144728f55b8d7dd) Thanks [@jxom](https://github.com/jxom)! - Parse tuples correctly in `parseContractResult`

* Updated dependencies [[`35e4219`](https://github.com/tmm/wagmi/commit/35e42199af9dd346549c1718e144728f55b8d7dd)]:
  - @wagmi/core@0.4.7

## 0.5.8

### Patch Changes

- [#670](https://github.com/tmm/wagmi/pull/670) [`29a0d21`](https://github.com/tmm/wagmi/commit/29a0d21ee83995559f63542778dfa805f15e7441) Thanks [@tmm](https://github.com/tmm)! - Fix broken release not containing `deepEqual` from `@wagmi/core`.

- Updated dependencies [[`29a0d21`](https://github.com/tmm/wagmi/commit/29a0d21ee83995559f63542778dfa805f15e7441)]:
  - @wagmi/core@0.4.6

## 0.5.7

### Patch Changes

- [#659](https://github.com/tmm/wagmi/pull/659) [`be76586`](https://github.com/tmm/wagmi/commit/be76586431238dc5a0970a6f10a3dff9faa8ca2d) Thanks [@jxom](https://github.com/jxom)! - Added an `isDataEqual` config option to `useContractRead`, `useContractReads` & `useContractInfiniteReads` to define whether or not that data has changed. Defaults to `deepEqual`.

* [#659](https://github.com/tmm/wagmi/pull/659) [`be76586`](https://github.com/tmm/wagmi/commit/be76586431238dc5a0970a6f10a3dff9faa8ca2d) Thanks [@jxom](https://github.com/jxom)! - Added `onBlock` config to `useBlockNumber`

- [#659](https://github.com/tmm/wagmi/pull/659) [`be76586`](https://github.com/tmm/wagmi/commit/be76586431238dc5a0970a6f10a3dff9faa8ca2d) Thanks [@jxom](https://github.com/jxom)! - Fixed an issue where `useContractRead` & `useContractReads` would return unstable data.

## 0.5.6

### Patch Changes

- [#654](https://github.com/tmm/wagmi/pull/654) [`e66530b`](https://github.com/tmm/wagmi/commit/e66530bf4881b3533c528f8c5a5f41be0eab0a64) Thanks [@jxom](https://github.com/jxom)! - omit `contractInterface` from `useContractRead` & `useContractReads` query key hash

* [#654](https://github.com/tmm/wagmi/pull/654) [`e66530b`](https://github.com/tmm/wagmi/commit/e66530bf4881b3533c528f8c5a5f41be0eab0a64) Thanks [@jxom](https://github.com/jxom)! - fix `multicall` returning nullish data for all calls unexpectedly

* Updated dependencies [[`e66530b`](https://github.com/tmm/wagmi/commit/e66530bf4881b3533c528f8c5a5f41be0eab0a64)]:
  - @wagmi/core@0.4.5

## 0.5.5

### Patch Changes

- [#629](https://github.com/tmm/wagmi/pull/629) [`199db71`](https://github.com/tmm/wagmi/commit/199db7165eed43d36cb882d373f95e7c49212f23) Thanks [@jxom](https://github.com/jxom)! - Add `wagmi/actions` entrypoint that exports imperative `@wagmi/core` actions

* [#616](https://github.com/tmm/wagmi/pull/616) [`7a7a17a`](https://github.com/tmm/wagmi/commit/7a7a17a46d4c9e6465cc46a111b5fe8a56109f1b) Thanks [@tmm](https://github.com/tmm)! - Adds `UNSTABLE_shimOnConnectSelectAccount` flag. With this flag and "disconnected" with `shimDisconnect` enabled, the user is prompted to select a different MetaMask account (than the currently connected account) when trying to connect (e.g. `useConnect`/`connect` action).

* Updated dependencies [[`7a7a17a`](https://github.com/tmm/wagmi/commit/7a7a17a46d4c9e6465cc46a111b5fe8a56109f1b)]:
  - @wagmi/core@0.4.4

## 0.5.4

### Patch Changes

- [#631](https://github.com/tmm/wagmi/pull/631) [`a780e32`](https://github.com/tmm/wagmi/commit/a780e32e91a0072c795fa0b5a6111302768e2a01) Thanks [@tmm](https://github.com/tmm)! - Fix WalletConnect stale session

- Updated dependencies [[`a780e32`](https://github.com/tmm/wagmi/commit/a780e32e91a0072c795fa0b5a6111302768e2a01)]:
  - @wagmi/core@0.4.3

## 0.5.3

### Patch Changes

- [#627](https://github.com/tmm/wagmi/pull/627) [`5985530`](https://github.com/tmm/wagmi/commit/59855301d138313e83a607b3f05053e9f46a78a8) Thanks [@jxom](https://github.com/jxom)! - equalityFn in `useSyncExternalStoreWithTracked` should return truthy when there are no tracked keys.

## 0.5.2

### Patch Changes

- [#624](https://github.com/tmm/wagmi/pull/624) [`416fa7e`](https://github.com/tmm/wagmi/commit/416fa7ee1f8019ab86e33fb93783ffddecc02c49) Thanks [@jxom](https://github.com/jxom)! - Fix broken `WebSocketProvider` type defs

- Updated dependencies [[`416fa7e`](https://github.com/tmm/wagmi/commit/416fa7ee1f8019ab86e33fb93783ffddecc02c49)]:
  - @wagmi/core@0.4.2

## 0.5.1

### Patch Changes

- [#622](https://github.com/tmm/wagmi/pull/622) [`d171581`](https://github.com/tmm/wagmi/commit/d171581464891dd870d97b6232205da0cb152d9b) Thanks [@tmm](https://github.com/tmm)! - Use `domain.chainId` to validate and switch chain before signing in `useSignTypedData`.

* [#618](https://github.com/tmm/wagmi/pull/618) [`a5138e8`](https://github.com/tmm/wagmi/commit/a5138e82a00e4d9469ad78c97b2d34200d7f1fbe) Thanks [@tmm](https://github.com/tmm)! - Fix adding chains when using MetaMask mobile app, add `publicRpcUrls` constant, and default to public endpoint when adding chain.

* Updated dependencies [[`d171581`](https://github.com/tmm/wagmi/commit/d171581464891dd870d97b6232205da0cb152d9b), [`a5138e8`](https://github.com/tmm/wagmi/commit/a5138e82a00e4d9469ad78c97b2d34200d7f1fbe)]:
  - @wagmi/core@0.4.1

## 0.5.0

### Minor Changes

- [`fc94210`](https://github.com/tmm/wagmi/commit/fc94210b67daa91aa164625dfe189d5b6c2f92d4) Thanks [@jxom](https://github.com/jxom)! - **Breaking**: The `useContractWrite` hook parameters have been consolidated into a singular config parameter.

  Before:

  ```tsx
  useContractWrite(
    {
      addressOrName: mlootContractAddress,
      contractInterface: mlootABI,
    },
    'claim',
  )
  ```

  After:

  ```tsx
  useContractWrite({
    addressOrName: mlootContractAddress,
    contractInterface: mlootABI,
    functionName: 'claim',
  })
  ```

* [`fc94210`](https://github.com/tmm/wagmi/commit/fc94210b67daa91aa164625dfe189d5b6c2f92d4) Thanks [@jxom](https://github.com/jxom)! - **Breaking**: The `useContractEvent` hook parameters have been consolidated into a singular config parameter.

  Before:

  ```tsx
  useContractEvent(
    {
      addressOrName: uniContractAddress,
      contractInterface: erc20ABI,
    },
    'Transfer',
    listener,
  ),
  ```

  After:

  ```tsx
  useContractEvent({
    addressOrName: uniContractAddress,
    contractInterface: erc20ABI,
    eventName: 'Transfer',
    listener,
  })
  ```

- [`fc94210`](https://github.com/tmm/wagmi/commit/fc94210b67daa91aa164625dfe189d5b6c2f92d4) Thanks [@jxom](https://github.com/jxom)! - **Breaking**: The `client` prop is now required on `WagmiConfig`.

  ````diff
  ```tsx
  import {
    createClient,
  + configureChains,
  + defaultChains
  } from 'wagmi'
  +import { publicProvider } from 'wagmi/providers/public'

  +const { provider, webSocketProvider } = configureChains(defaultChains, [
  + publicProvider(),
  +])

  +const client = createClient({
  + provider,
  + webSocketProvider,
  +})

  function App() {
    return (
      <WagmiConfig
  +     client={client}
      >
        <YourRoutes />
      </WagmiConfig>
    )
  }
  ````

* [`fc94210`](https://github.com/tmm/wagmi/commit/fc94210b67daa91aa164625dfe189d5b6c2f92d4) Thanks [@jxom](https://github.com/jxom)! - **Breaking**: The `provider` config option is now required on `createClient`. It is recommended to pass the [`provider` given from `configureChains`](https://wagmi.sh/docs/providers/configuring-chains).

  ```diff
  import {
    createClient,
  + defaultChains,
  + configureChains
  } from 'wagmi'
  +import { publicProvider } from 'wagmi/providers/publicProvider'

  +const { provider } = configureChains(defaultChains, [
  + publicProvider
  +])

  const client = createClient({
  + provider
  })
  ```

  If you previously used an ethers.js Provider, you now need to provide your `chains` on the Provider instance:

  ```diff
  import {
    createClient,
  + defaultChains
  } from 'wagmi'
  import ethers from 'ethers'

  const client = createClient({
  - provider: getDefaultProvider()
  + provider: Object.assign(getDefaultProvider(), { chains: defaultChains })
  })
  ```

- [`4f8f3c0`](https://github.com/tmm/wagmi/commit/4f8f3c0d65383bd8bbdfc3f1033adfdb11d80ebb) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Use ethereum-lists chains symbols

* [#582](https://github.com/tmm/wagmi/pull/582) [`b03830a`](https://github.com/tmm/wagmi/commit/b03830a54465215c2526f9509543fe2c978bfe70) Thanks [@jxom](https://github.com/jxom)! - **Breaking**: The following changes were made to the `useAccount` return value:

  ### The `data` value is now `address` & `connector`

  ```diff
  {
  - data?: {
  -   address: string
  -   connector: Connector
  - }
  + address?: string
  + connector?: Connector
  }
  ```

  ### Global connection status values have been added

  The following global connection status values have been added:

  ```diff
  {
  + isConnecting: boolean
  + isReconnecting: boolean
  + isConnected: boolean
  + isDisconnected: boolean
  + status: 'connecting' | 'reconnecting' | 'connected' | 'disconnected'
  }
  ```

  The `useAccount` hook is now aware of any connection event in your application, so now you can use these connection status values to determine if your user is connected, disconnected or connecting to a wallet on a global scope.

  ### `error`, states & `refetch` values have been removed

  Since the `useAccount` hook never dealt with asynchronous data, all of these values were
  redundant & unused.

  ```diff
  {
  - error?: Error
  - isIdle: boolean
  - isLoading: boolean
  - isFetching: boolean
  - isSuccess: boolean
  - isError: boolean
  - isFetched: boolean
  - isRefetching: boolean
  - refetch: (options: {
  -   throwOnError: boolean
  -   cancelRefetch: boolean
  - }) => Promise<{
  -   address: string
  -   connector: Connector
  - }>
  - status: 'idle' | 'error' | 'loading' | 'success'
  }
  ```

  ### Summary of changes

  Below is the whole diff of changes to the `useAccount` return value.

  ```diff
  {
  - data?: {
  -   address: string
  -   connector: Connector
  - }
  + address?: string
  + connector?: Connector
  - error?: Error
  - isIdle: boolean
  - isLoading: boolean
  - isFetching: boolean
  - isSuccess: boolean
  - isError: boolean
  - isFetched: boolean
  - isRefetching: boolean
  + isConnecting: boolean
  + isReconnecting: boolean
  + isConnected: boolean
  + isDisconnected: boolean
  - refetch: (options: {
  -   throwOnError: boolean
  -   cancelRefetch: boolean
  - }) => Promise<{
  -   address: string
  -   connector: Connector
  - }>
  - status: 'idle' | 'error' | 'loading' | 'success'
  + status: 'connecting' | 'reconnecting' | 'connected' | 'disconnected'
  }
  ```

- [`fc94210`](https://github.com/tmm/wagmi/commit/fc94210b67daa91aa164625dfe189d5b6c2f92d4) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Removed the `chainId` parameter from `connectors` function on `createClient`.

  ```diff
  const client = createClient({
  - connectors({ chainId }) {
  + connectors() {
      ...
    }
  })
  ```

  If you previously derived RPC URLs from the `chainId` on `connectors`, you can now remove that logic as `wagmi` now handles RPC URLs internally when used with `configureChains`.

  ```diff
  import {
    chain,
  +  configureChains,
    createClient
  } from 'wagmi';

  +import { publicProvider } from 'wagmi/providers/public'

  import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
  import { InjectedConnector } from 'wagmi/connectors/injected'
  import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
  import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

  +const { chains } = configureChains(
  +  [chain.mainnet],
  +  [publicProvider()]
  +);

  const client = createClient({
  -  connectors({ chainId }) {
  -    const chain = chains.find((x) => x.id === chainId) ?? defaultChain
  -    const rpcUrl = chain.rpcUrls.alchemy
  -      ? `${chain.rpcUrls.alchemy}/${alchemyId}`
  -      : chain.rpcUrls.default
  -    return [
  +  connectors: [
      new MetaMaskConnector({ chains }),
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: 'wagmi',
  -       chainId: chain.id,
  -       jsonRpcUrl: rpcUrl,
        },
      }),
      new WalletConnectConnector({
        chains,
        options: {
          qrcode: true,
  -       rpc: { [chain.id]: rpcUrl },
        },
      }),
      new InjectedConnector({
        chains,
        options: { name: 'Injected' },
      }),
    ]
  -  },
  })
  ```

* [#596](https://github.com/tmm/wagmi/pull/596) [`a770af7`](https://github.com/tmm/wagmi/commit/a770af7d2cb214b6620d5341115f1e938e1e77ff) Thanks [@tmm](https://github.com/tmm)! - **Breaking**: `TypedDataDomain` and `TypedDataField` types were removed and incorporated into `SignTypedDataArgs`.

- [#582](https://github.com/tmm/wagmi/pull/582) [`b03830a`](https://github.com/tmm/wagmi/commit/b03830a54465215c2526f9509543fe2c978bfe70) Thanks [@jxom](https://github.com/jxom)! - **Breaking**: The following changes were made to the `useAccount` configuration:

  ## `onConnect` has been added

  The `onConnect` callback is invoked when the account connects.

  It provides the connected address & connector, as well as a `isReconnected` flag for if the user reconnected via `autoConnect`.

  ```tsx
  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log('Connected')
    },
  })
  ```

  ## `onDisconnect` has been added

  The `onDisconnect` callback is invoked when the account disconnected.

  ```tsx
  const account = useAccount({
    onDisconnect() {
      console.log('Disconnected')
    },
  })
  ```

  ## `suspense` has been removed

  The `useAccount` hook is a synchronous hook – so `suspense` never worked.

  ```diff
  const account = useAccount({
  -  suspense: true,
  })
  ```

  ## `onError` has been removed

  The `useAccount` hook never had any error definitions – so `onError` was never invoked.

  ```diff
  const account = useAccount({
  - onError(error) {
  -   console.log('Error', error)
  - },
  })
  ```

  ## `onSettled` has been removed

  The `useAccount` hook is a synchronous hook. `onSettled` was always invoked immediately.

  ```diff
  const account = useAccount({
  - onSettled(data) {
  -   console.log('Settled', data)
  - },
  })
  ```

  If you used `onSettled`, you can move the code beneath the `useAccount` hook:

  ```diff
  const account = useAccount({
  - onSettled(data) {
  -   console.log('Address:', data.address)
  - },
  })
  + console.log('Address:', account.address)
  ```

  ## `onSuccess` has been removed

  The `useAccount` hook is a synchronous hook. `onSuccess` was always invoked immediately.

  ```diff
  const account = useAccount({
  - onSuccess(data) {
  -   console.log('Success', data)
  - },
  })
  ```

  If you used `onSuccess`, you can move the code beneath the `useAccount` hook:

  ```diff
  const account = useAccount({
  - onSuccess(data) {
  -   console.log('Address:', data.address)
  - },
  })
  + console.log('Address:', account.address)
  ```

* [#582](https://github.com/tmm/wagmi/pull/582) [`b03830a`](https://github.com/tmm/wagmi/commit/b03830a54465215c2526f9509543fe2c978bfe70) Thanks [@jxom](https://github.com/jxom)! - **Breaking**: The following changes were made to the `useConnect` return value:

  ### Connection status flags have been moved

  The `isConnected`, `isConnecting`, `isReconnecting` & `isDisconnected` flags have been moved to the `useAccount` hook.

  ```diff
  -import { useConnect } from 'wagmi'
  +import { useAccount } from 'wagmi'

  function App() {
    const {
      isConnected,
      isConnecting,
      isConnecting,
      isDisconnected
  - } = useConnect()
  + } = useAccount()
  }
  ```

  ### New `connect` mutation status flags have been added

  The `isLoading`, `isSuccess` and `isError` flags have been added to `useConnect`.

  These flags represent the **local** async state of `useConnect`.

  ### `activeConnector` has been removed

  The `activeConnector` value has been removed. You can find the active connector on `useAccount`.

  ```diff
  -import { useConnect } from 'wagmi'
  +import { useAccount } from 'wagmi'

  function App() {
  - const { activeConnector } = useConnect()
  + const { connector } = useAccount()
  }
  ```

- [#582](https://github.com/tmm/wagmi/pull/582) [`b03830a`](https://github.com/tmm/wagmi/commit/b03830a54465215c2526f9509543fe2c978bfe70) Thanks [@jxom](https://github.com/jxom)! - **Breaking**: The following changes were made to the `useConnect` configuration:

  ### `onBeforeConnect` has been renamed

  The `onBeforeConnect` callback has been renamed to `onMutate`

  ### `onConnect` has been renamed

  The `onConnect` callback has been renamed to `onSuccess`

* [#582](https://github.com/tmm/wagmi/pull/582) [`b03830a`](https://github.com/tmm/wagmi/commit/b03830a54465215c2526f9509543fe2c978bfe70) Thanks [@jxom](https://github.com/jxom)! - **Breaking**: The `connector` parameter to `connect` & `connectAsync` now has to be in the config object parameter shape.

  ```diff
  import { useConnect } from 'wagmi'

  function App() {
    const { connect, connectors } = useConnect()

    return (
      <button
  -     onClick={() => connect(connectors[0])}
  +     onClick={() => connect({ connector: connectors[0] })}
      >
        Connect
      </button>
    )
  }
  ```

- [#582](https://github.com/tmm/wagmi/pull/582) [`b03830a`](https://github.com/tmm/wagmi/commit/b03830a54465215c2526f9509543fe2c978bfe70) Thanks [@jxom](https://github.com/jxom)! - **Breaking**: The "switch network" functionality has been moved out of `useNetwork` into a new `useSwitchNetwork` hook.

  The `useNetwork` hook now accepts no configuration and only returns `chain` (renamed from `activeChain`) and `chains`.

  ```diff
  import {
    useNetwork
  + useSwitchNetwork
  } from 'wagmi'

  const {
  - activeChain
  + chain,
    chains,
  - data,
  - error,
  - isError,
  - isIdle,
  - isLoading,
  - isSuccess,
  - pendingChainId,
  - switchNetwork,
  - switchNetworkAsync,
  - status,
  - reset,
  -} = useNetwork({
  - chainId: 69,
  - onError(error) {},
  - onMutate(args) {},
  - onSettled(data, error) {},
  - onSuccess(data) {}
  -})
  +} = useNetwork()

  +const {
  + data,
  + error,
  + isError,
  + isIdle,
  + isLoading,
  + isSuccess,
  + pendingChainId,
  + switchNetwork,
  + switchNetworkAsync,
  + status,
  + reset,
  +} = useSwitchNetwork({
  + chainId: 69,
  + onError(error) {},
  + onMutate(args) {},
  + onSettled(data, error) {},
  + onSuccess(data) {}
  +})
  ```

* [`fc94210`](https://github.com/tmm/wagmi/commit/fc94210b67daa91aa164625dfe189d5b6c2f92d4) Thanks [@jxom](https://github.com/jxom)! - **Breaking**: The `useContractRead` hook parameters have been consolidated into a singular config parameter.

  Before:

  ```tsx
  useContractRead(
    {
      addressOrName: wagmigotchiContractAddress,
      contractInterface: wagmigotchiABI,
    },
    'love',
    { args: '0x27a69ffba1e939ddcfecc8c7e0f967b872bac65c' },
  )
  ```

  After:

  ```tsx
  useContractRead({
    addressOrName: wagmigotchiContractAddress,
    contractInterface: wagmigotchiABI,
    functionName: 'love',
    args: '0x27a69ffba1e939ddcfecc8c7e0f967b872bac65c',
  })
  ```

### Patch Changes

- [`fc94210`](https://github.com/tmm/wagmi/commit/fc94210b67daa91aa164625dfe189d5b6c2f92d4) Thanks [@jxom](https://github.com/jxom)! - Added a `useContractInfiniteReads` hook that provides the ability to call multiple ethers Contract read-only methods with "infinite scrolling" ("fetch more") support. Useful for rendering a dynamic list of contract data.

  [Learn more](https://wagmi.sh/docs/hooks/useContractInfiniteReads)

* [`fc94210`](https://github.com/tmm/wagmi/commit/fc94210b67daa91aa164625dfe189d5b6c2f92d4) Thanks [@jxom](https://github.com/jxom)! - Added a `useContractReads` hook that provides the ability to batch up multiple ethers Contract read-only methods.

  [Learn more](https://wagmi.sh/docs/hooks/useContractReads)

- [#598](https://github.com/tmm/wagmi/pull/598) [`fef26bf`](https://github.com/tmm/wagmi/commit/fef26bf8aef76fc9621e3cd54d4e0ca8f69abb38) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Update `@coinbase/wallet-sdk` to fix errors when connecting with older versions of the Coinbase Wallet extension and mobile app.

* [#611](https://github.com/tmm/wagmi/pull/611) [`3089c34`](https://github.com/tmm/wagmi/commit/3089c34196d4034acabac031e0a2f7ee63ae30cc) Thanks [@tmm](https://github.com/tmm)! - Added `chainId` config parameter for `useContractWrite` and `useSendTransaction`.

  If `chainId` is provided, the connector will validate that `chainId` is the active chain before sending a transaction (and switch to `chainId` if necessary).

* Updated dependencies [[`fc94210`](https://github.com/tmm/wagmi/commit/fc94210b67daa91aa164625dfe189d5b6c2f92d4), [`fc94210`](https://github.com/tmm/wagmi/commit/fc94210b67daa91aa164625dfe189d5b6c2f92d4), [`4f8f3c0`](https://github.com/tmm/wagmi/commit/4f8f3c0d65383bd8bbdfc3f1033adfdb11d80ebb), [`fc94210`](https://github.com/tmm/wagmi/commit/fc94210b67daa91aa164625dfe189d5b6c2f92d4), [`3089c34`](https://github.com/tmm/wagmi/commit/3089c34196d4034acabac031e0a2f7ee63ae30cc), [`a770af7`](https://github.com/tmm/wagmi/commit/a770af7d2cb214b6620d5341115f1e938e1e77ff), [`4f8f3c0`](https://github.com/tmm/wagmi/commit/4f8f3c0d65383bd8bbdfc3f1033adfdb11d80ebb), [`fef26bf`](https://github.com/tmm/wagmi/commit/fef26bf8aef76fc9621e3cd54d4e0ca8f69abb38), [`fc94210`](https://github.com/tmm/wagmi/commit/fc94210b67daa91aa164625dfe189d5b6c2f92d4), [`3089c34`](https://github.com/tmm/wagmi/commit/3089c34196d4034acabac031e0a2f7ee63ae30cc), [`b03830a`](https://github.com/tmm/wagmi/commit/b03830a54465215c2526f9509543fe2c978bfe70), [`fc94210`](https://github.com/tmm/wagmi/commit/fc94210b67daa91aa164625dfe189d5b6c2f92d4), [`fc94210`](https://github.com/tmm/wagmi/commit/fc94210b67daa91aa164625dfe189d5b6c2f92d4)]:
  - @wagmi/core@0.4.0

## 0.4.12

### Patch Changes

- [#570](https://github.com/tmm/wagmi/pull/570) [`0e3fe15`](https://github.com/tmm/wagmi/commit/0e3fe15445377f35d6f4142b49bf1c96bfeb62cd) Thanks [@tmm](https://github.com/tmm)! - adds chain for [Foundry](https://github.com/foundry-rs)

- Updated dependencies [[`0e3fe15`](https://github.com/tmm/wagmi/commit/0e3fe15445377f35d6f4142b49bf1c96bfeb62cd)]:
  - @wagmi/core@0.3.8

## 0.4.11

### Patch Changes

- [#566](https://github.com/tmm/wagmi/pull/566) [`8713c00`](https://github.com/tmm/wagmi/commit/8713c00f70fcac3afef4ba183e3c87c6d3cbbf65) Thanks [@jxom](https://github.com/jxom)! - Fixed `parseContractResult` breaking `useContractRead` for more complex contract types

## 0.4.10

### Patch Changes

- [`20a1ab7`](https://github.com/tmm/wagmi/commit/20a1ab7bd02a24c4f1ea02be1bc3ecfbe4abc584) Thanks [@jxom](https://github.com/jxom)! - Updated to `react-query@4.0.0-beta.23`

* [`20a1ab7`](https://github.com/tmm/wagmi/commit/20a1ab7bd02a24c4f1ea02be1bc3ecfbe4abc584) Thanks [@jxom](https://github.com/jxom)! - Fixed an issue in `useContractRead` where contract structs wouldn't be parsed back to an ethers `Result` correctly.

## 0.4.9

### Patch Changes

- [#555](https://github.com/tmm/wagmi/pull/555) [`8bf014d`](https://github.com/tmm/wagmi/commit/8bf014d8167e9f9feb1fd91488aab42dd51c92af) Thanks [@tmm](https://github.com/tmm)! - wire up `useEnsName` `chainId`

## 0.4.8

### Patch Changes

- [#550](https://github.com/tmm/wagmi/pull/550) [`2a5313e`](https://github.com/tmm/wagmi/commit/2a5313e8cbc9ba6335e8e4b85e43862c9b711bd3) Thanks [@tmm](https://github.com/tmm)! - fix `CoinbaseWalletConnector` possible type error

* [#548](https://github.com/tmm/wagmi/pull/548) [`0c48719`](https://github.com/tmm/wagmi/commit/0c487199f2421f042abc1f1d139468ccbbc5646a) Thanks [@dohaki](https://github.com/dohaki)! - add ensAddress to Chain type

- [#549](https://github.com/tmm/wagmi/pull/549) [`89b3a74`](https://github.com/tmm/wagmi/commit/89b3a74ead4234daacd0dcf8506659887ebf0553) Thanks [@tmm](https://github.com/tmm)! - Turns on [`noUncheckedIndexedAccess`](https://www.typescriptlang.org/tsconfig#noUncheckedIndexedAccess=) and [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks=) for better runtime safety.

- Updated dependencies [[`2a5313e`](https://github.com/tmm/wagmi/commit/2a5313e8cbc9ba6335e8e4b85e43862c9b711bd3), [`0c48719`](https://github.com/tmm/wagmi/commit/0c487199f2421f042abc1f1d139468ccbbc5646a), [`89b3a74`](https://github.com/tmm/wagmi/commit/89b3a74ead4234daacd0dcf8506659887ebf0553)]:
  - @wagmi/core@0.3.7

## 0.4.7

### Patch Changes

- [#526](https://github.com/tmm/wagmi/pull/526) [`e95c5f9`](https://github.com/tmm/wagmi/commit/e95c5f91859e57d079b962a72d06b93dce004d2f) Thanks [@jxom](https://github.com/jxom)! - Added `shimChainChangedDisconnect` option to `InjectedConnector`. Defaults to `true` for `MetaMaskConnector`.

* [#526](https://github.com/tmm/wagmi/pull/526) [`e95c5f9`](https://github.com/tmm/wagmi/commit/e95c5f91859e57d079b962a72d06b93dce004d2f) Thanks [@jxom](https://github.com/jxom)! - Added `chainId` config option to `useConnect()` & `connect()`. Consumers can now pick what chain they want their user to be connected to.

  Examples:

  ```tsx
  import { useConnect, chain } from 'wagmi'
  import { InjectedConnector } from 'wagmi/connectors/injected'

  function App() {
    const connect = useConnect({
      chainId: chain.polygon.id,
    })
  }
  ```

  ```tsx
  import { useConnect, chain } from 'wagmi'
  import { InjectedConnector } from 'wagmi/connectors/injected'

  function App() {
    const connect = useConnect()

    return (
      <button onClick={() => connect({ chainId: chain.optimism.id })}>
        Connect to Optimism
      </button>
    )
  }
  ```

* Updated dependencies [[`e95c5f9`](https://github.com/tmm/wagmi/commit/e95c5f91859e57d079b962a72d06b93dce004d2f), [`e95c5f9`](https://github.com/tmm/wagmi/commit/e95c5f91859e57d079b962a72d06b93dce004d2f), [`e95c5f9`](https://github.com/tmm/wagmi/commit/e95c5f91859e57d079b962a72d06b93dce004d2f)]:
  - @wagmi/core@0.3.6

## 0.4.6

### Patch Changes

- [#543](https://github.com/tmm/wagmi/pull/543) [`4d489fd`](https://github.com/tmm/wagmi/commit/4d489fd630dd8c00440bdaf4d646de662c41ff52) Thanks [@tmm](https://github.com/tmm)! - fix fee data formatting for null values

- Updated dependencies [[`4d489fd`](https://github.com/tmm/wagmi/commit/4d489fd630dd8c00440bdaf4d646de662c41ff52)]:
  - @wagmi/core@0.3.5

## 0.4.5

### Patch Changes

- [`01cc47b`](https://github.com/tmm/wagmi/commit/01cc47b2385c78d82bc799c2dedacb2a42457e2f) Thanks [@jxom](https://github.com/jxom)! - Update `react-query` to `4.0.0-beta.19`

## 0.4.4

### Patch Changes

- [`c4deb66`](https://github.com/tmm/wagmi/commit/c4deb6655a52e4cc4e5b3fd82202db11d6106848) Thanks [@jxom](https://github.com/jxom)! - infer `options.chainId` config from `chains` on WalletConnectConnector

- Updated dependencies [[`c4deb66`](https://github.com/tmm/wagmi/commit/c4deb6655a52e4cc4e5b3fd82202db11d6106848)]:
  - @wagmi/core@0.3.4

## 0.4.3

### Patch Changes

- [#486](https://github.com/tmm/wagmi/pull/486) [`dbfe3dd`](https://github.com/tmm/wagmi/commit/dbfe3dd320d178d6854a8096101200c1508786bb) Thanks [@tmm](https://github.com/tmm)! - add chains entrypoint

- Updated dependencies [[`dbfe3dd`](https://github.com/tmm/wagmi/commit/dbfe3dd320d178d6854a8096101200c1508786bb)]:
  - @wagmi/core@0.3.3

## 0.4.2

### Patch Changes

- [`b1a2e58`](https://github.com/tmm/wagmi/commit/b1a2e5830e325be448bf865aeccda60217fc8d75) Thanks [@jxom](https://github.com/jxom)! - Made the `defaultChains` type generic in `configureChains`.

## 0.4.1

### Patch Changes

- [#484](https://github.com/tmm/wagmi/pull/484) [`1b9a503`](https://github.com/tmm/wagmi/commit/1b9a5033d51c6655b4f6570c490da6e0e9a29da9) Thanks [@tmm](https://github.com/tmm)! - export React Context

- Updated dependencies [[`1b9a503`](https://github.com/tmm/wagmi/commit/1b9a5033d51c6655b4f6570c490da6e0e9a29da9)]:
  - @wagmi/core@0.3.1

## 0.4.0

### Minor Changes

- [#468](https://github.com/tmm/wagmi/pull/468) [`44a884b`](https://github.com/tmm/wagmi/commit/44a884b84171c418f57701e80ef8de972948ef0b) Thanks [@tmm](https://github.com/tmm)! - **Breaking:** Duplicate exports with different names and the same functionality were removed to simplify the public API. In addition, confusing exports were renamed to be more descriptive.

  - `createWagmiClient` alias was removed. Use `createClient` instead.
  - `useWagmiClient` alias was removed. Use `useClient` instead.
  - `WagmiClient` alias was removed. Use `Client` instead.
  - `createWagmiStorage` alias was removed. Use `createStorage` instead.
  - `Provider` was renamed and `WagmiProvider` alias was removed. Use `WagmiConfig` instead.

* [#408](https://github.com/tmm/wagmi/pull/408) [`bfcc3a5`](https://github.com/tmm/wagmi/commit/bfcc3a51bbb1551753e3ccde6af134e9fd4fec9a) Thanks [@jxom](https://github.com/jxom)! - Add `configureChains` API.

  The `configureChains` function allows you to configure your chains with a selected provider (Alchemy, Infura, JSON RPC, Public RPC URLs). This means you don't have to worry about deriving your own RPC URLs for each chain, or instantiating a Ethereum Provider.

  `configureChains` accepts 3 parameters: an array of chains, and an array of providers, and a config object.

  [Learn more about configuring chains & providers.](https://wagmi.sh/docs/providers/configuring-chains)

  ### Before

  ```tsx
  import { providers } from 'ethers'
  import { chain, createClient, defaultChains } from 'wagmi'
  import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
  import { InjectedConnector } from 'wagmi/connectors/injected'
  import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
  import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

  const alchemyId = process.env.ALCHEMY_ID

  const chains = defaultChains
  const defaultChain = chain.mainnet

  const client = createClient({
    autoConnect: true,
    connectors({ chainId }) {
      const chain = chains.find((x) => x.id === chainId) ?? defaultChain
      const rpcUrl = chain.rpcUrls.alchemy
        ? `${chain.rpcUrls.alchemy}/${alchemyId}`
        : chain.rpcUrls.default
      return [
        new MetaMaskConnector({ chains }),
        new CoinbaseWalletConnector({
          chains,
          options: {
            appName: 'wagmi',
            chainId: chain.id,
            jsonRpcUrl: rpcUrl,
          },
        }),
        new WalletConnectConnector({
          chains,
          options: {
            qrcode: true,
            rpc: { [chain.id]: rpcUrl },
          },
        }),
        new InjectedConnector({
          chains,
          options: {
            name: 'Injected',
            shimDisconnect: true,
          },
        }),
      ]
    },
    provider: ({ chainId }) =>
      new providers.AlchemyProvider(chainId, alchemyId),
  })
  ```

  ### After

  ```tsx
  import { chain, createClient, defaultChains } from 'wagmi'

  import { alchemyProvider } from 'wagmi/providers/alchemy'
  import { publicProvider } from 'wagmi/providers/public'

  import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
  import { InjectedConnector } from 'wagmi/connectors/injected'
  import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
  import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

  const alchemyId = process.env.ALCHEMY_ID

  const { chains, provider, webSocketProvider } = configureChains(
    defaultChains,
    [alchemyProvider({ alchemyId }), publicProvider()],
  )

  const client = createClient({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: 'wagmi',
        },
      }),
      new WalletConnectConnector({
        chains,
        options: {
          qrcode: true,
        },
      }),
      new InjectedConnector({
        chains,
        options: {
          name: 'Injected',
          shimDisconnect: true,
        },
      }),
    ],
    provider,
    webSocketProvider,
  })
  ```

### Patch Changes

- [#404](https://github.com/tmm/wagmi/pull/404) [`f81c156`](https://github.com/tmm/wagmi/commit/f81c15665e2e71534f84ada3fa705f2d78627472) Thanks [@holic](https://github.com/holic)! - Add `ProviderRpcError` and `RpcError` error classes.

  Certain wagmi-standardized errors may wrap `ProviderRpcError` or `RpcError`. For these cases, you can access the original provider rpc or rpc error value using the `internal` property.

* [#459](https://github.com/tmm/wagmi/pull/459) [`72dcf7c`](https://github.com/tmm/wagmi/commit/72dcf7c09e814261b2e43a8fa364c57675c472de) Thanks [@tmm](https://github.com/tmm)! - update dependencies

- [#447](https://github.com/tmm/wagmi/pull/447) [`b9ebf78`](https://github.com/tmm/wagmi/commit/b9ebf782e0900725bcb76483686b30f09d357ebd) Thanks [@tmm](https://github.com/tmm)! - Fix case where connector disconnected while app was closed and stale data was returned when autoconnecting. For example, [MetaMask was locked](https://github.com/tmm/wagmi/issues/444) when page was closed.

- Updated dependencies [[`f81c156`](https://github.com/tmm/wagmi/commit/f81c15665e2e71534f84ada3fa705f2d78627472), [`bfcc3a5`](https://github.com/tmm/wagmi/commit/bfcc3a51bbb1551753e3ccde6af134e9fd4fec9a), [`44a884b`](https://github.com/tmm/wagmi/commit/44a884b84171c418f57701e80ef8de972948ef0b), [`72dcf7c`](https://github.com/tmm/wagmi/commit/72dcf7c09e814261b2e43a8fa364c57675c472de), [`a54f3e2`](https://github.com/tmm/wagmi/commit/a54f3e23ea385ed8aa4ad188128d7089ba20f83e), [`b9ebf78`](https://github.com/tmm/wagmi/commit/b9ebf782e0900725bcb76483686b30f09d357ebd), [`bfcc3a5`](https://github.com/tmm/wagmi/commit/bfcc3a51bbb1551753e3ccde6af134e9fd4fec9a)]:
  - @wagmi/core@0.3.0

## 0.3.5

### Patch Changes

- [`4e03666`](https://github.com/tmm/wagmi/commit/4e03666428d42fc9186c617001b5eb356229677e) Thanks [@tmm](https://github.com/tmm)! - bump dependencies #429
  add imToken support for WC switch chains #432
  fix MetaMask and Brave Wallet collision #436
- Updated dependencies [[`4e03666`](https://github.com/tmm/wagmi/commit/4e03666428d42fc9186c617001b5eb356229677e)]:
  - @wagmi/core@0.2.5

## 0.3.4

### Patch Changes

- [#421](https://github.com/tmm/wagmi/pull/421) [`a232b3f`](https://github.com/tmm/wagmi/commit/a232b3ff5cc41e882c4d2a34c599a8cb670edd2b) Thanks [@tmm](https://github.com/tmm)! - fix erc721 abi

- Updated dependencies [[`a232b3f`](https://github.com/tmm/wagmi/commit/a232b3ff5cc41e882c4d2a34c599a8cb670edd2b)]:
  - @wagmi/core@0.2.4

## 0.3.3

### Patch Changes

- [#412](https://github.com/tmm/wagmi/pull/412) [`80bef4f`](https://github.com/tmm/wagmi/commit/80bef4ff3f714b0b8f896f1b4b658acc7266299b) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Import providers from `ethers` peer dependency rather than `@ethersproject/providers` to avoid multiple conflicting versions being installed

- Updated dependencies [[`80bef4f`](https://github.com/tmm/wagmi/commit/80bef4ff3f714b0b8f896f1b4b658acc7266299b)]:
  - @wagmi/core@0.2.3

## 0.3.2

### Patch Changes

- [`018c2a1`](https://github.com/tmm/wagmi/commit/018c2a11b22ee513571cc7f83fd63f7eb169ee70) Thanks [@tmm](https://github.com/tmm)! - - warn and fallback to default client #380

  - remove signerOrProvider option from read contract #390

  - MetaMaskConnector #391

- Updated dependencies [[`018c2a1`](https://github.com/tmm/wagmi/commit/018c2a11b22ee513571cc7f83fd63f7eb169ee70)]:
  - @wagmi/core@0.2.2

## 0.3.1

### Patch Changes

- [`afc4607`](https://github.com/tmm/wagmi/commit/afc46071e91601ab8a2b465524da796cd60b6ad4) Thanks [@tmm](https://github.com/tmm)! - - Fix time scaling e9593df
  - Use fully-specified path for use-sync-external-store import 7b235c1
  - Update serialize 236fc17
- Updated dependencies [[`afc4607`](https://github.com/tmm/wagmi/commit/afc46071e91601ab8a2b465524da796cd60b6ad4)]:
  - @wagmi/core@0.2.1

## 0.3.0

### Minor Changes

- [#311](https://github.com/tmm/wagmi/pull/311) [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d) Thanks [@tmm](https://github.com/tmm)! - don't persist account data when `autoConnect` is falsy

* [#311](https://github.com/tmm/wagmi/pull/311) [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d) Thanks [@tmm](https://github.com/tmm)! - - fix(@wagmi/core): persist connector chains to local storage

- [#311](https://github.com/tmm/wagmi/pull/311) [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d) Thanks [@tmm](https://github.com/tmm)! - - Favour `message` event over `connecting` event to conform to EIP-1193
  - Export `useWaitForTransaction`

* [#311](https://github.com/tmm/wagmi/pull/311) [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d) Thanks [@tmm](https://github.com/tmm)! - force address to be required in `useAccount`

- [#311](https://github.com/tmm/wagmi/pull/311) [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d) Thanks [@tmm](https://github.com/tmm)! - Initial 0.3.0 release

* [#311](https://github.com/tmm/wagmi/pull/311) [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d) Thanks [@tmm](https://github.com/tmm)! - Add `cacheOnBlock` config for `useContractRead`
  Update `react-query` to v4
  Fix `watchBlockNumber` listener leak

- [#311](https://github.com/tmm/wagmi/pull/311) [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d) Thanks [@tmm](https://github.com/tmm)! - - fix `useContractWrite` mutation fn arguments

* [#311](https://github.com/tmm/wagmi/pull/311) [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d) Thanks [@tmm](https://github.com/tmm)! - Update react-query to 4.0.0-beta.5

### Patch Changes

- [#311](https://github.com/tmm/wagmi/pull/311) [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d) Thanks [@tmm](https://github.com/tmm)! - add chainId to actions and hooks

* [#311](https://github.com/tmm/wagmi/pull/311) [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d) Thanks [@tmm](https://github.com/tmm)! - showtime

- [#311](https://github.com/tmm/wagmi/pull/311) [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d) Thanks [@tmm](https://github.com/tmm)! - improve type support for ethers providers

* [#311](https://github.com/tmm/wagmi/pull/311) [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d) Thanks [@tmm](https://github.com/tmm)! - update zustand

- [#311](https://github.com/tmm/wagmi/pull/311) [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d) Thanks [@tmm](https://github.com/tmm)! - update babel target

* [#311](https://github.com/tmm/wagmi/pull/311) [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d) Thanks [@tmm](https://github.com/tmm)! - update block explorers and rpc urls structure

- [#311](https://github.com/tmm/wagmi/pull/311) [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d) Thanks [@tmm](https://github.com/tmm)! - keep previous data when watching

* [#311](https://github.com/tmm/wagmi/pull/311) [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d) Thanks [@tmm](https://github.com/tmm)! - republish

- [#311](https://github.com/tmm/wagmi/pull/311) [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d) Thanks [@tmm](https://github.com/tmm)! - fix stale connectors when switching chains

* [#311](https://github.com/tmm/wagmi/pull/311) [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d) Thanks [@tmm](https://github.com/tmm)! - last beta

* Updated dependencies [[`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d), [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d), [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d), [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d), [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d), [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d), [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d), [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d), [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d), [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d), [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d), [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d), [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d), [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d), [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d), [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d), [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d), [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d)]:
  - @wagmi/core@0.2.0

## 0.3.0-next.21

### Patch Changes

- showtime

- Updated dependencies []:
  - @wagmi/core@0.2.0-next.18

## 0.3.0-next.20

### Patch Changes

- update block explorers and rpc urls structure

- Updated dependencies []:
  - @wagmi/core@0.2.0-next.17

## 0.3.0-next.19

### Minor Changes

- Update react-query to 4.0.0-beta.5

## 0.3.0-next.18

### Patch Changes

- last beta

- Updated dependencies []:
  - @wagmi/core@0.2.0-next.16

## 0.3.0-next.17

### Patch Changes

- update zustand

- Updated dependencies []:
  - @wagmi/core@0.2.0-next.15

## 0.3.0-next.16

### Minor Changes

- Add `cacheOnBlock` config for `useContractRead`
- Update `react-query` to v4
- Fix `watchBlockNumber` listener leak

### Patch Changes

- Updated dependencies []:
  - @wagmi/core@0.2.0-next.14

## 0.3.0-next.15

### Patch Changes

- keep previous data when watching

- Updated dependencies []:
  - @wagmi/core@0.2.0-next.13

## 0.3.0-next.14

### Patch Changes

- add chainId to actions and hooks

- Updated dependencies []:
  - @wagmi/core@0.2.0-next.12

## 0.3.0-next.13

### Patch Changes

- fix stale connectors when switching chains

- Updated dependencies []:
  - @wagmi/core@0.2.0-next.11

## 0.3.0-next.12

### Patch Changes

- republish

- Updated dependencies []:
  - @wagmi/core@0.2.0-next.10

## 0.3.0-next.11

### Patch Changes

- improve type support for ethers providers

- Updated dependencies []:
  - @wagmi/core@0.2.0-next.9

## 0.3.0-next.10

### Patch Changes

- update babel target

- Updated dependencies []:
  - @wagmi/core@0.2.0-next.8

## 0.3.0-next.9

### Minor Changes

- - Favour `message` event over `connecting` event to conform to EIP-1193
  - Export `useWaitForTransaction`

### Patch Changes

- Updated dependencies []:
  - @wagmi/core@0.2.0-next.7

## 0.3.0-next.8

### Patch Changes

- Updated dependencies []:
  - @wagmi/core@0.2.0-next.6

## 0.3.0-next.7

### Minor Changes

- don't persist account data when `autoConnect` is falsy

### Patch Changes

- Updated dependencies []:
  - @wagmi/core@0.2.0-next.5

## 0.3.0-next.6

### Minor Changes

- fix `useContractWrite` mutation fn arguments

### Patch Changes

- Updated dependencies []:
  - @wagmi/core@0.2.0-next.4

## 0.3.0-next.5

### Patch Changes

- Updated dependencies []:
  - @wagmi/core@0.2.0-next.3

## 0.3.0-next.4

### Minor Changes

- force address to be required in `useAccount`

## 0.3.0-next.3

### Patch Changes

- Updated dependencies []:
  - @wagmi/core@0.2.0-next.2

## 0.3.0-next.2

### Minor Changes

- Initial 0.3.0 release

### Patch Changes

- Updated dependencies []:
  - @wagmi/core@0.2.0-next.1

## 0.2.28

### Patch Changes

- [`747d895`](https://github.com/tmm/wagmi/commit/747d895a54b562958afde34b1d34e81ab5039e2c) Thanks [@tmm](https://github.com/tmm)! - add warning to WalletLinkConnector

- Updated dependencies [[`747d895`](https://github.com/tmm/wagmi/commit/747d895a54b562958afde34b1d34e81ab5039e2c)]:
  - wagmi-core@0.1.22

## 0.2.27

### Patch Changes

- [`c858c51`](https://github.com/tmm/wagmi/commit/c858c51b44d9039f1d0db5bcf016639f47d1931f) Thanks [@tmm](https://github.com/tmm)! - update coinbase connector

- Updated dependencies [[`c858c51`](https://github.com/tmm/wagmi/commit/c858c51b44d9039f1d0db5bcf016639f47d1931f)]:
  - wagmi-core@0.1.21

## 0.2.26

### Patch Changes

- Updated dependencies [[`36e6989`](https://github.com/tmm/wagmi/commit/36e69894f4c27aaad7fb6d678476c8bb870244bb)]:
  - wagmi-core@0.1.20

## 0.2.25

### Patch Changes

- [`d467df6`](https://github.com/tmm/wagmi/commit/d467df6374210dbc4b016788b4beb4fded54cb4d) Thanks [@tmm](https://github.com/tmm)! - fix global type leaking

- Updated dependencies [[`d467df6`](https://github.com/tmm/wagmi/commit/d467df6374210dbc4b016788b4beb4fded54cb4d)]:
  - wagmi-core@0.1.19

## 0.2.24

### Patch Changes

- [#294](https://github.com/tmm/wagmi/pull/294) [`1d253f3`](https://github.com/tmm/wagmi/commit/1d253f3a59b61d24c88d25c99decd84a6c734e5d) Thanks [@tmm](https://github.com/tmm)! - change babel target

- Updated dependencies [[`1d253f3`](https://github.com/tmm/wagmi/commit/1d253f3a59b61d24c88d25c99decd84a6c734e5d)]:
  - wagmi-core@0.1.18

## 0.2.23

### Patch Changes

- [#292](https://github.com/tmm/wagmi/pull/292) [`53c9be1`](https://github.com/tmm/wagmi/commit/53c9be17ee0c2ae6b8f34f2351b8858257b3f5f2) Thanks [@tmm](https://github.com/tmm)! - fix private fields

- Updated dependencies [[`53c9be1`](https://github.com/tmm/wagmi/commit/53c9be17ee0c2ae6b8f34f2351b8858257b3f5f2)]:
  - wagmi-core@0.1.17

## 0.2.22

### Patch Changes

- [`79a2499`](https://github.com/tmm/wagmi/commit/79a249989029f818c32c0e84c0dd2c75e8aa990a) Thanks [@tmm](https://github.com/tmm)! - update build target to es2021

- Updated dependencies [[`79a2499`](https://github.com/tmm/wagmi/commit/79a249989029f818c32c0e84c0dd2c75e8aa990a)]:
  - wagmi-core@0.1.16

## 0.2.21

### Patch Changes

- [`f9790b5`](https://github.com/tmm/wagmi/commit/f9790b55600df09c77bb8ca349c5a3457df1b07c) Thanks [@tmm](https://github.com/tmm)! - fix WalletConnect issue

- Updated dependencies [[`f9790b5`](https://github.com/tmm/wagmi/commit/f9790b55600df09c77bb8ca349c5a3457df1b07c)]:
  - wagmi-core@0.1.15

## 0.2.20

### Patch Changes

- [`fed29fb`](https://github.com/tmm/wagmi/commit/fed29fb4714abe234e2dabb63782cfc4439a10cf) Thanks [@tmm](https://github.com/tmm)! - export useSignTypedData

## 0.2.19

### Patch Changes

- [`6987278`](https://github.com/tmm/wagmi/commit/69872786e0b54b89a20945cc5471c1f4675b0a68) Thanks [@tmm](https://github.com/tmm)! - add useSignedTypeData

## 0.2.18

### Patch Changes

- [#236](https://github.com/tmm/wagmi/pull/236) [`53bad61`](https://github.com/tmm/wagmi/commit/53bad615788764e31121678083c382c1bd042fe8) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Updated `@walletconnect/ethereum-provider` to [v1.7.4](https://github.com/WalletConnect/walletconnect-monorepo/releases/tag/1.7.4)

- Updated dependencies [[`53bad61`](https://github.com/tmm/wagmi/commit/53bad615788764e31121678083c382c1bd042fe8)]:
  - wagmi-core@0.1.14

## 0.2.17

### Patch Changes

- [`8e9412a`](https://github.com/tmm/wagmi/commit/8e9412af71958301ae2f9748febb936e79900aa0) Thanks [@tmm](https://github.com/tmm)! - bump walletlink

- Updated dependencies [[`8e9412a`](https://github.com/tmm/wagmi/commit/8e9412af71958301ae2f9748febb936e79900aa0)]:
  - wagmi-core@0.1.13

## 0.2.16

### Patch Changes

- [#210](https://github.com/tmm/wagmi/pull/210) [`684468a`](https://github.com/tmm/wagmi/commit/684468aee3e42a1ce2b4b599f3f17d1819213de8) Thanks [@tmm](https://github.com/tmm)! - update chains to match chainslist.org

- Updated dependencies [[`684468a`](https://github.com/tmm/wagmi/commit/684468aee3e42a1ce2b4b599f3f17d1819213de8)]:
  - wagmi-core@0.1.12

## 0.2.15

### Patch Changes

- [#195](https://github.com/tmm/wagmi/pull/195) [`25b6083`](https://github.com/tmm/wagmi/commit/25b6083a662a0236794d1765343467691421c14b) Thanks [@tmm](https://github.com/tmm)! - rename wagmi-private to wagmi-core

- Updated dependencies [[`25b6083`](https://github.com/tmm/wagmi/commit/25b6083a662a0236794d1765343467691421c14b)]:
  - wagmi-core@0.1.11

## 0.2.14

### Patch Changes

- [#192](https://github.com/tmm/wagmi/pull/192) [`428cedb`](https://github.com/tmm/wagmi/commit/428cedb3dec4e3e4b9f4559c8e65932e05f94e05) Thanks [@tmm](https://github.com/tmm)! - rename core and testing packages

- Updated dependencies [[`428cedb`](https://github.com/tmm/wagmi/commit/428cedb3dec4e3e4b9f4559c8e65932e05f94e05)]:
  - wagmi-core@0.1.10

## 0.2.13

### Patch Changes

- [#190](https://github.com/tmm/wagmi/pull/190) [`7034bb8`](https://github.com/tmm/wagmi/commit/7034bb868412b9f481b206371280e84c2d52706d) Thanks [@tmm](https://github.com/tmm)! - add shim for metamask chain changed to prevent disconnect

- Updated dependencies [[`7034bb8`](https://github.com/tmm/wagmi/commit/7034bb868412b9f481b206371280e84c2d52706d)]:
  - wagmi-private@0.1.9

## 0.2.12

### Patch Changes

- [`566b47f`](https://github.com/tmm/wagmi/commit/566b47f53c80e1cdcc368d43c53b1772eeb5be20) Thanks [@tmm](https://github.com/tmm)! - fix contract read skip option

## 0.2.11

### Patch Changes

- [`09f0719`](https://github.com/tmm/wagmi/commit/09f071947012e3133362a7eb80c0f39356899190) Thanks [@tmm](https://github.com/tmm)! - - safe state updates h/t @bpierre
  - add useEnsResolveName hook h/t @shunkakinoki

## 0.2.10

### Patch Changes

- [#159](https://github.com/tmm/wagmi/pull/159) [`981438d`](https://github.com/tmm/wagmi/commit/981438d527fb6b5f025dd9bb405fa9e7a2751597) Thanks [@markdalgleish](https://github.com/markdalgleish)! - add `WagmiProvider` alias for `Provider`

## 0.2.9

### Patch Changes

- [#137](https://github.com/tmm/wagmi/pull/137) [`dceeb43`](https://github.com/tmm/wagmi/commit/dceeb430d9021fbf98366859cb1cd0149e80c55c) Thanks [@tmm](https://github.com/tmm)! - add siwe guide

- Updated dependencies [[`dceeb43`](https://github.com/tmm/wagmi/commit/dceeb430d9021fbf98366859cb1cd0149e80c55c)]:
  - wagmi-private@0.1.8

## 0.2.8

### Patch Changes

- [`b49cb89`](https://github.com/tmm/wagmi/commit/b49cb89ef59289ee1185eafab427d3ab55c17c25) Thanks [@tmm](https://github.com/tmm)! - refactor contract read/write hook state

## 0.2.7

### Patch Changes

- [`7132631`](https://github.com/tmm/wagmi/commit/713263159899feb257c11614716f0af4f6b06a14) Thanks [@tmm](https://github.com/tmm)! - update contract read and write state

## 0.2.6

### Patch Changes

- [#127](https://github.com/tmm/wagmi/pull/127) [`f05b031`](https://github.com/tmm/wagmi/commit/f05b0310f7f7e6447e9b6c81cedbb27dcf2f3649) Thanks [@tmm](https://github.com/tmm)! - update switch chain return type

- Updated dependencies [[`f05b031`](https://github.com/tmm/wagmi/commit/f05b0310f7f7e6447e9b6c81cedbb27dcf2f3649)]:
  - wagmi-private@0.1.7

## 0.2.5

### Patch Changes

- [`1412eed`](https://github.com/tmm/wagmi/commit/1412eed0d1494bb4f8c6845a0e890f79e4e68e03) Thanks [@tmm](https://github.com/tmm)! - add frame to injected

- Updated dependencies [[`1412eed`](https://github.com/tmm/wagmi/commit/1412eed0d1494bb4f8c6845a0e890f79e4e68e03)]:
  - wagmi-private@0.1.6

## 0.2.4

### Patch Changes

- [#122](https://github.com/tmm/wagmi/pull/122) [`94f599c`](https://github.com/tmm/wagmi/commit/94f599cc1de74a977956d4118d85ab0d36915471) Thanks [@tmm](https://github.com/tmm)! - add decimals to useBalance

## 0.2.3

### Patch Changes

- [`e338c3b`](https://github.com/tmm/wagmi/commit/e338c3b6cc255742be6a67593aa5da6c17e90fbd) Thanks [@tmm](https://github.com/tmm)! - checksum connector address on change events

  add shim to injected connector for simulating disconnect

- Updated dependencies [[`e338c3b`](https://github.com/tmm/wagmi/commit/e338c3b6cc255742be6a67593aa5da6c17e90fbd)]:
  - wagmi-private@0.1.5

## 0.2.2

### Patch Changes

- [`0176c4e`](https://github.com/tmm/wagmi/commit/0176c4e83fb0c5f159c3c802a1da3d6deb2184ae) Thanks [@tmm](https://github.com/tmm)! - added switchChain to WalletConnect and WalletLink connectors

- Updated dependencies [[`0176c4e`](https://github.com/tmm/wagmi/commit/0176c4e83fb0c5f159c3c802a1da3d6deb2184ae)]:
  - wagmi-private@0.1.4

## 0.2.1

### Patch Changes

- [`f12d9cc`](https://github.com/tmm/wagmi/commit/f12d9ccfdf87a2f75299b53a7dd6b1ad046a49d8) Thanks [@tmm](https://github.com/tmm)! - fixes overrides type

## 0.2.0

### Minor Changes

- [#98](https://github.com/tmm/wagmi/pull/98) [`b2ec758`](https://github.com/tmm/wagmi/commit/b2ec7580436f52fd35005c6dd3f4472650a14d02) Thanks [@oveddan](https://github.com/oveddan)! - Exported Context

## 0.1.7

### Patch Changes

- [`d965757`](https://github.com/tmm/wagmi/commit/d9657578bc17648716c4671b8cc35ad295bc71d2) Thanks [@tmm](https://github.com/tmm)! - use balance eth symbol

## 0.1.6

### Patch Changes

- [`071d7fb`](https://github.com/tmm/wagmi/commit/071d7fbca35ec4832700b5343661ceb2dae20598) Thanks [@tmm](https://github.com/tmm)! - add hardhat chain

- Updated dependencies [[`071d7fb`](https://github.com/tmm/wagmi/commit/071d7fbca35ec4832700b5343661ceb2dae20598)]:
  - wagmi-private@0.1.3

## 0.1.5

### Patch Changes

- [`db4d869`](https://github.com/tmm/wagmi/commit/db4d869fd9380b26a1f3f96ab34abd14ca73d068) Thanks [@tmm](https://github.com/tmm)! - - add global connecting property for `Provider` `autoConnect` (h/t @sammdec)
  - fix `useContractEvent` error (h/t @math-marcellino)

## 0.1.4

### Patch Changes

- [#73](https://github.com/tmm/wagmi/pull/73) [`0c78ccc`](https://github.com/tmm/wagmi/commit/0c78ccc4e7f311525d4ea712b79cf532899e2006) Thanks [@tmm](https://github.com/tmm)! - fix module exports

## 0.1.3

### Patch Changes

- [`78bade9`](https://github.com/tmm/wagmi/commit/78bade9d0da97ab38a7e6594c34e3841ec1c8fe6) Thanks [@tmm](https://github.com/tmm)! - add type definitions

- Updated dependencies [[`78bade9`](https://github.com/tmm/wagmi/commit/78bade9d0da97ab38a7e6594c34e3841ec1c8fe6)]:
  - wagmi-private@0.1.2

## 0.1.2

### Patch Changes

- [#56](https://github.com/tmm/wagmi/pull/56) [`2ebfd8e`](https://github.com/tmm/wagmi/commit/2ebfd8e85b560f25cd46cff04619c84643cab297) Thanks [@tmm](https://github.com/tmm)! - add chain support status

- Updated dependencies [[`2ebfd8e`](https://github.com/tmm/wagmi/commit/2ebfd8e85b560f25cd46cff04619c84643cab297)]:
  - wagmi-private@0.1.1

## 0.1.1

### Patch Changes

- [#54](https://github.com/tmm/wagmi/pull/54) [`25acd3d`](https://github.com/tmm/wagmi/commit/25acd3dfbb4498af5e1139ae9c892f5013404cbc) Thanks [@tmm](https://github.com/tmm)! - Stale contract object when useContract hook arguments change @zakangelle

## 0.1.0

### Minor Changes

- [#52](https://github.com/tmm/wagmi/pull/52) [`da7a3a6`](https://github.com/tmm/wagmi/commit/da7a3a615def2443f65c041999100ce35e9774cc) Thanks [@tmm](https://github.com/tmm)! - Moves connectors to their own entrypoints to reduce bundle size.

  ```ts
  // old - WalletLinkConnector unused, but still in final bundle
  import { InjectedConnector, WalletConnectConnector } from 'wagmi'

  // new - WalletLinkConnector not in final bundle
  import { InjectedConnector } from 'wagmi/connectors/injected'
  import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
  ```

### Patch Changes

- Updated dependencies [[`da7a3a6`](https://github.com/tmm/wagmi/commit/da7a3a615def2443f65c041999100ce35e9774cc)]:
  - wagmi-private@0.1.0

## 0.0.17

### Patch Changes

- [#25](https://github.com/tmm/wagmi/pull/25) [`9a7dab7`](https://github.com/tmm/wagmi/commit/9a7dab78b3518658bc7d85dc397990f0d28da175) Thanks [@tmm](https://github.com/tmm)! - update response types

- Updated dependencies [[`9a7dab7`](https://github.com/tmm/wagmi/commit/9a7dab78b3518658bc7d85dc397990f0d28da175)]:
  - wagmi-private@0.0.17

## 0.0.16

### Patch Changes

- [`d1574cf`](https://github.com/tmm/wagmi/commit/d1574cf5f7a578ccd480889c2e375134145a4aba) Thanks [@tmm](https://github.com/tmm)! - add better type information for contract results

- Updated dependencies [[`d1574cf`](https://github.com/tmm/wagmi/commit/d1574cf5f7a578ccd480889c2e375134145a4aba)]:
  - wagmi-private@0.0.16

## 0.0.15

### Patch Changes

- [`3909624`](https://github.com/tmm/wagmi/commit/39096249c1fa9516beabb11735beb67c94032879) Thanks [@tmm](https://github.com/tmm)! - make contract read and write execute overrides param optional

- Updated dependencies [[`3909624`](https://github.com/tmm/wagmi/commit/39096249c1fa9516beabb11735beb67c94032879)]:
  - wagmi-private@0.0.15

## 0.0.14

### Patch Changes

- [`63312e2`](https://github.com/tmm/wagmi/commit/63312e2b06b8d835abc2908cba399d941ca79408) Thanks [@tmm](https://github.com/tmm)! - add once to contract event

- Updated dependencies [[`63312e2`](https://github.com/tmm/wagmi/commit/63312e2b06b8d835abc2908cba399d941ca79408)]:
  - wagmi-private@0.0.14

## 0.0.13

### Patch Changes

- [`6f890b0`](https://github.com/tmm/wagmi/commit/6f890b0dabbdbea913ec91cb8bfc970c05ed0a93) Thanks [@tmm](https://github.com/tmm)! - update readme

- Updated dependencies [[`6f890b0`](https://github.com/tmm/wagmi/commit/6f890b0dabbdbea913ec91cb8bfc970c05ed0a93)]:
  - wagmi-private@0.0.13

## 0.0.12

### Patch Changes

- [#19](https://github.com/tmm/wagmi/pull/19) [`7bc1c47`](https://github.com/tmm/wagmi/commit/7bc1c47875e9ef24e9c79cfafc6b23e7a838b5bc) Thanks [@tmm](https://github.com/tmm)! - remove console log from walletlink connector

- Updated dependencies [[`7bc1c47`](https://github.com/tmm/wagmi/commit/7bc1c47875e9ef24e9c79cfafc6b23e7a838b5bc)]:
  - wagmi-private@0.0.12

## 0.0.11

### Patch Changes

- [#17](https://github.com/tmm/wagmi/pull/17) [`571648b`](https://github.com/tmm/wagmi/commit/571648b754f7f538536bafc9387bd3104657ea49) Thanks [@tmm](https://github.com/tmm)! - standardize connector provider

- Updated dependencies [[`571648b`](https://github.com/tmm/wagmi/commit/571648b754f7f538536bafc9387bd3104657ea49)]:
  - wagmi-private@0.0.11

## 0.0.10

### Patch Changes

- [#15](https://github.com/tmm/wagmi/pull/15) [`5f7675c`](https://github.com/tmm/wagmi/commit/5f7675c3ffd848522d4117c07c1f62b17dfc6616) Thanks [@tmm](https://github.com/tmm)! - read and write contract functions

- Updated dependencies [[`5f7675c`](https://github.com/tmm/wagmi/commit/5f7675c3ffd848522d4117c07c1f62b17dfc6616)]:
  - wagmi-private@0.0.10

## 0.0.9

### Patch Changes

- [#13](https://github.com/tmm/wagmi/pull/13) [`e5545f5`](https://github.com/tmm/wagmi/commit/e5545f5565cf0bbf5e62ec7ccab3051705b1d313) Thanks [@tmm](https://github.com/tmm)! - add testing package

- Updated dependencies [[`e5545f5`](https://github.com/tmm/wagmi/commit/e5545f5565cf0bbf5e62ec7ccab3051705b1d313)]:
  - wagmi-private@0.0.9

## 0.0.8

### Patch Changes

- [`5332500`](https://github.com/tmm/wagmi/commit/5332500918ac240d29ffe4d2aed8566a8ac001e4) Thanks [@tmm](https://github.com/tmm)! - update signing

- Updated dependencies [[`5332500`](https://github.com/tmm/wagmi/commit/5332500918ac240d29ffe4d2aed8566a8ac001e4)]:
  - wagmi-private@0.0.8

## 0.0.7

### Patch Changes

- [`0bff89a`](https://github.com/tmm/wagmi/commit/0bff89ab2ad28b2cb9b346d1ac870e859d9278bc) Thanks [@tmm](https://github.com/tmm)! - update injected connector

- Updated dependencies [[`0bff89a`](https://github.com/tmm/wagmi/commit/0bff89ab2ad28b2cb9b346d1ac870e859d9278bc)]:
  - wagmi-private@0.0.7

## 0.0.6

### Patch Changes

- [`37d39d1`](https://github.com/tmm/wagmi/commit/37d39d174ddfa122462bbe2d02141cd61eb9db4a) Thanks [@tmm](https://github.com/tmm)! - add message signing

- Updated dependencies [[`37d39d1`](https://github.com/tmm/wagmi/commit/37d39d174ddfa122462bbe2d02141cd61eb9db4a)]:
  - wagmi-private@0.0.6

## 0.0.5

### Patch Changes

- [`d7d94f0`](https://github.com/tmm/wagmi/commit/d7d94f06f7d30468e5e39d64db63124c6315cf82) Thanks [@tmm](https://github.com/tmm)! - fix injected connector name

- Updated dependencies [[`d7d94f0`](https://github.com/tmm/wagmi/commit/d7d94f06f7d30468e5e39d64db63124c6315cf82)]:
  - wagmi-private@0.0.5

## 0.0.4

### Patch Changes

- [`29fbe29`](https://github.com/tmm/wagmi/commit/29fbe2920046b9e87a34faa04500ccf3c4f83748) Thanks [@tmm](https://github.com/tmm)! - fix external deps

- Updated dependencies [[`29fbe29`](https://github.com/tmm/wagmi/commit/29fbe2920046b9e87a34faa04500ccf3c4f83748)]:
  - wagmi-private@0.0.4

## 0.0.3

### Patch Changes

- [#6](https://github.com/tmm/wagmi/pull/6) [`8dc3a5d`](https://github.com/tmm/wagmi/commit/8dc3a5d5f418813b09663534fe585d9bcf94dbeb) Thanks [@tmm](https://github.com/tmm)! - clean up deps

- Updated dependencies [[`8dc3a5d`](https://github.com/tmm/wagmi/commit/8dc3a5d5f418813b09663534fe585d9bcf94dbeb)]:
  - wagmi-private@0.0.3

## 0.0.2

### Patch Changes

- [#4](https://github.com/tmm/wagmi/pull/4) [`2fbd821`](https://github.com/tmm/wagmi/commit/2fbd8216379bd03c9cc5c06b10b75637e75cb7d8) Thanks [@tmm](https://github.com/tmm)! - init changesets

- Updated dependencies [[`2fbd821`](https://github.com/tmm/wagmi/commit/2fbd8216379bd03c9cc5c06b10b75637e75cb7d8)]:
  - wagmi-private@0.0.2
