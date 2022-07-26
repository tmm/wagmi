# @wagmi/core

## 0.5.0

### Minor Changes

- [#658](https://github.com/wagmi-dev/wagmi/pull/658) [`d70c115`](https://github.com/wagmi-dev/wagmi/commit/d70c115131f299fb61f87867b6ac4218e0bcf432) Thanks [@jxom](https://github.com/jxom)! - **Breaking**: The configuration passed to the `sendTransaction` action now needs to be:

  - prepared with the `prepareSendTransaction` action **(new functionality)**, or
  - recklessly unprepared **(previous functionality)**

  > Why? [Read here](https://wagmi.sh/docs/prepare-hooks/intro)

  ### Prepared usage

  ```diff
  import { prepareSendTransaction, sendTransaction } from '@wagmi/core'

  +const config = await prepareSendTransaction({
  +  request: {
  +    to: 'moxey.eth',
  +    value: parseEther('1'),
  +  }
  +})

  const result = await sendTransaction({
  - request: {
  -   to: 'moxey.eth',
  -   value: parseEther('1')
  - }
  + ...config
  })
  ```

  ### Recklessly unprepared usage

  It is possible to use `sendTransaction` without preparing the configuration first by passing `mode: 'recklesslyUnprepared'`.

  ```diff
  import { sendTransaction } from '@wagmi/core'

  const result = await sendTransaction({
  + mode: 'recklesslyUnprepared',
    request: {
      to: 'moxey.eth',
      value: parseEther('1'),
    }
  })
  ```

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

* [#658](https://github.com/wagmi-dev/wagmi/pull/658) [`d70c115`](https://github.com/wagmi-dev/wagmi/commit/d70c115131f299fb61f87867b6ac4218e0bcf432) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** The `sendTransaction` action now returns an object only consisting of `hash` & `wait`, and not the full [`TransactionResponse`](https://docs.ethers.io/v5/api/providers/types/#providers-TransactionResponse).

  If you require the full `TransactionResponse`, you can use `fetchTransaction`:

  ```diff
  import { sendTransaction, fetchTransaction } from '@wagmi/core'

  const {
    hash,
    wait,
  - ...transaction
  } = sendTransaction(...)

  +const transaction = fetchTransaction({ hash })
  ```

  > Why? The old implementation of `sendTransaction` created a long-running async task, causing [UX pitfalls](https://wagmi.sh/docs/prepare-hooks/intro#ux-pitfalls-without-prepare-hooks) when invoked in a click handler.

- [#658](https://github.com/wagmi-dev/wagmi/pull/658) [`d70c115`](https://github.com/wagmi-dev/wagmi/commit/d70c115131f299fb61f87867b6ac4218e0bcf432) Thanks [@jxom](https://github.com/jxom)! - **Breaking**: If a `chainId` is passed to `writeContract` or `sendTransaction`, it will no longer attempt to switch chain before sending the transaction. Instead, it will throw an error if the user is on the wrong chain.

  > Why?
  >
  > - Eagerly prompting to switch chain in these actions created a long-running async task that that makes [iOS App Links](https://wagmi.sh/docs/prepare-hooks/intro#ios-app-link-constraints) vulnerable.
  > - Not all wallets support programmatic chain switching.

### Patch Changes

- [#658](https://github.com/wagmi-dev/wagmi/pull/658) [`d70c115`](https://github.com/wagmi-dev/wagmi/commit/d70c115131f299fb61f87867b6ac4218e0bcf432) Thanks [@jxom](https://github.com/jxom)! - **Breaking**: The configuration passed to the `writeContract` action now needs to be:

  - prepared with the `prepareWriteContract` action **(new functionality)**, or
  - recklessly unprepared **(previous functionality)**

  > Why? [Read here](https://wagmi.sh/docs/prepare-hooks/intro)

  ### Prepared usage

  ```diff
  import { prepareWriteContract, writeContract } from '@wagmi/core'

  const tokenId = 69

  +const config = await prepareWriteContract({
  + addressOrName: '0x...',
  + contractInterface: wagmiAbi,
  + functionName: 'mint',
  + args: [tokenId]
  +})

  const result = await writeContract({
  - addressOrName: '0x...',
  - contractInterface: wagmiAbi,
  - functionName: 'mint',
  - args: [tokenId],
  + ...config
  })
  ```

  ### Recklessly unprepared usage

  It is possible to use `writeContract` without preparing the configuration first by passing `mode: 'recklesslyUnprepared'`.

  ```diff
  import { writeContract } from '@wagmi/core'

  const tokenId = 69

  const result = await writeContract({
  + mode: 'recklesslyUnprepared',
    addressOrName: '0x...',
    contractInterface: wagmiAbi,
    functionName: 'mint',
    args: [tokenId],
  })
  ```

* [#658](https://github.com/wagmi-dev/wagmi/pull/658) [`d70c115`](https://github.com/wagmi-dev/wagmi/commit/d70c115131f299fb61f87867b6ac4218e0bcf432) Thanks [@jxom](https://github.com/jxom)! - Added the `prepareSendTransaction` hook that prepares the parameters required for sending a transaction.

  It returns config to be passed through to `sendTransaction`.

  ```ts
  import { prepareSendTransaction, sendTransaction } from '@wagmi/core'

  const config = await prepareSendTransaction({
    request: {
      to: 'moxey.eth',
      value: parseEther('1'),
    },
  })
  const result = await sendTransaction(config)
  ```

- [#658](https://github.com/wagmi-dev/wagmi/pull/658) [`d70c115`](https://github.com/wagmi-dev/wagmi/commit/d70c115131f299fb61f87867b6ac4218e0bcf432) Thanks [@jxom](https://github.com/jxom)! - Added the `prepareWriteContract` hook that prepares the parameters required for a contract write transaction.

  It returns config to be passed through to `writeContract`.

  Example:

  ```tsx
  import { prepareWriteContract, writeContract } from '@wagmi/core'

  const config = await prepareWriteContract({
    addressOrName: '0x...',
    contractInterface: wagmiAbi,
    functionName: 'mint',
  })
  const result = await writeContract(config)
  ```

* [#739](https://github.com/wagmi-dev/wagmi/pull/739) [`c2295a5`](https://github.com/wagmi-dev/wagmi/commit/c2295a56cc86d02cc6602e2b4557b8ab9a091a3f) Thanks [@tmm](https://github.com/tmm)! - Fix balance formatting for tokens that do not have 18 decimals.

- [#759](https://github.com/wagmi-dev/wagmi/pull/759) [`959953d`](https://github.com/wagmi-dev/wagmi/commit/959953d1f5b3e8189bac56de245c62333470d18e) Thanks [@tmm](https://github.com/tmm)! - Added `fetchTransaction` action:

  ```ts
  import { fetchTransaction } from '@wagmi/core'

  const transaction = await fetchTransaction({
    hash: '0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060',
  })
  ```

## 0.4.9

### Patch Changes

- [#721](https://github.com/tmm/wagmi/pull/721) [`abea25f`](https://github.com/tmm/wagmi/commit/abea25fd15d81d1ecaec9d3fbd687042ab29b1e6) Thanks [@tmm](https://github.com/tmm)! - Stay connected to existing `client.connector` when `connect` action fails to connect to new connector.

* [#721](https://github.com/tmm/wagmi/pull/721) [`abea25f`](https://github.com/tmm/wagmi/commit/abea25fd15d81d1ecaec9d3fbd687042ab29b1e6) Thanks [@tmm](https://github.com/tmm)! - Switch `fetchToken` action to multicall and add `name` output property.

## 0.4.8

### Patch Changes

- [#693](https://github.com/tmm/wagmi/pull/693) [`56e468c`](https://github.com/tmm/wagmi/commit/56e468c3617ec222527bb3c02eadec3ebeff923a) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Fix import errors with Coinbase Wallet SDK in Vite

## 0.4.7

### Patch Changes

- [#677](https://github.com/tmm/wagmi/pull/677) [`35e4219`](https://github.com/tmm/wagmi/commit/35e42199af9dd346549c1718e144728f55b8d7dd) Thanks [@jxom](https://github.com/jxom)! - Move `parseContractResult` to `@wagmi/core`

## 0.4.6

### Patch Changes

- [#670](https://github.com/tmm/wagmi/pull/670) [`29a0d21`](https://github.com/tmm/wagmi/commit/29a0d21ee83995559f63542778dfa805f15e7441) Thanks [@tmm](https://github.com/tmm)! - Added ethers-compatible `deepEqual` function.

## 0.4.5

### Patch Changes

- [#654](https://github.com/tmm/wagmi/pull/654) [`e66530b`](https://github.com/tmm/wagmi/commit/e66530bf4881b3533c528f8c5a5f41be0eab0a64) Thanks [@jxom](https://github.com/jxom)! - fix `multicall` returning nullish data for all calls unexpectedly

## 0.4.4

### Patch Changes

- [#616](https://github.com/tmm/wagmi/pull/616) [`7a7a17a`](https://github.com/tmm/wagmi/commit/7a7a17a46d4c9e6465cc46a111b5fe8a56109f1b) Thanks [@tmm](https://github.com/tmm)! - Adds `UNSTABLE_shimOnConnectSelectAccount` flag. With this flag and "disconnected" with `shimDisconnect` enabled, the user is prompted to select a different MetaMask account (than the currently connected account) when trying to connect (e.g. `useConnect`/`connect` action).

## 0.4.3

### Patch Changes

- [#631](https://github.com/tmm/wagmi/pull/631) [`a780e32`](https://github.com/tmm/wagmi/commit/a780e32e91a0072c795fa0b5a6111302768e2a01) Thanks [@tmm](https://github.com/tmm)! - Fix WalletConnect stale session

## 0.4.2

### Patch Changes

- [#624](https://github.com/tmm/wagmi/pull/624) [`416fa7e`](https://github.com/tmm/wagmi/commit/416fa7ee1f8019ab86e33fb93783ffddecc02c49) Thanks [@jxom](https://github.com/jxom)! - Fix broken `WebSocketProvider` type defs

## 0.4.1

### Patch Changes

- [#622](https://github.com/tmm/wagmi/pull/622) [`d171581`](https://github.com/tmm/wagmi/commit/d171581464891dd870d97b6232205da0cb152d9b) Thanks [@tmm](https://github.com/tmm)! - Use `domain.chainId` to validate and switch chain before signing in `signTypedData`.

* [#618](https://github.com/tmm/wagmi/pull/618) [`a5138e8`](https://github.com/tmm/wagmi/commit/a5138e82a00e4d9469ad78c97b2d34200d7f1fbe) Thanks [@tmm](https://github.com/tmm)! - Fix adding chains when using MetaMask mobile app, add `publicRpcUrls` constant, and default to public endpoint when adding chain.

## 0.4.0

### Minor Changes

- [`fc94210`](https://github.com/tmm/wagmi/commit/fc94210b67daa91aa164625dfe189d5b6c2f92d4) Thanks [@jxom](https://github.com/jxom)! - **Breaking**: The `provider` config option is now required on `createClient`. It is recommended to pass the [`provider` given from `configureChains`](https://wagmi.sh/docs/providers/configuring-chains).

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

* [`4f8f3c0`](https://github.com/tmm/wagmi/commit/4f8f3c0d65383bd8bbdfc3f1033adfdb11d80ebb) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Use ethereum-lists chains symbols

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

* [#611](https://github.com/tmm/wagmi/pull/611) [`3089c34`](https://github.com/tmm/wagmi/commit/3089c34196d4034acabac031e0a2f7ee63ae30cc) Thanks [@tmm](https://github.com/tmm)! - **Breaking**: `Connector`s `getProvider` method no longer supports the `create` config parameter. Use the `chainId` config option instead.

- [#596](https://github.com/tmm/wagmi/pull/596) [`a770af7`](https://github.com/tmm/wagmi/commit/a770af7d2cb214b6620d5341115f1e938e1e77ff) Thanks [@tmm](https://github.com/tmm)! - **Breaking**: `TypedDataDomain` and `TypedDataField` types were removed and incorporated into `SignTypedDataArgs`.

* [`4f8f3c0`](https://github.com/tmm/wagmi/commit/4f8f3c0d65383bd8bbdfc3f1033adfdb11d80ebb) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Update symbols to match ethereum-lists/chains

- [`fc94210`](https://github.com/tmm/wagmi/commit/fc94210b67daa91aa164625dfe189d5b6c2f92d4) Thanks [@jxom](https://github.com/jxom)! - **Breaking**: The `writeContract` function parameters have been consolidated into a singular config parameter.

  Before:

  ```tsx
  writeContract(
    {
      addressOrName: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
      contractInterface: wagmigotchiABI,
    },
    'feed',
  )
  ```

  After:

  ```tsx
  readContract({
    addressOrName: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
    contractInterface: wagmigotchiABI,
    functionName: 'feed',
  })
  ```

### Patch Changes

- [`fc94210`](https://github.com/tmm/wagmi/commit/fc94210b67daa91aa164625dfe189d5b6c2f92d4) Thanks [@jxom](https://github.com/jxom)! - **Breaking**: The `readContract` & `watchReadContract` function parameters have been consolidated into a singular config parameter.

  Before:

  ```tsx
  readContract(
    {
      addressOrName: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
      contractInterface: wagmigotchiABI,
    },
    'getHunger',
    { args: [0] },
  )

  watchReadContract(
    {
      addressOrName: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
      contractInterface: wagmigotchiABI,
    },
    'getHunger',
    { args: [0] },
    (result) => {},
  )
  ```

  After:

  ```tsx
  readContract({
    addressOrName: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
    contractInterface: wagmigotchiABI,
    functionName: 'getHunger',
    args: [0],
  })

  watchReadContract(
    {
      addressOrName: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
      contractInterface: wagmigotchiABI,
      functionName: 'getHunger',
      args: [0],
    },
    (result) => {},
  )
  ```

* [#598](https://github.com/tmm/wagmi/pull/598) [`fef26bf`](https://github.com/tmm/wagmi/commit/fef26bf8aef76fc9621e3cd54d4e0ca8f69abb38) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Update `@coinbase/wallet-sdk` peer dependency to `>=3.3.0` to fix errors when connecting with older versions of the Coinbase Wallet extension and mobile app.

- [#611](https://github.com/tmm/wagmi/pull/611) [`3089c34`](https://github.com/tmm/wagmi/commit/3089c34196d4034acabac031e0a2f7ee63ae30cc) Thanks [@tmm](https://github.com/tmm)! - Added `chainId` config parameter for `writeContract` and `sendTransaction`.

  If `chainId` is provided, the connector will validate that `chainId` is the active chain before sending a transaction (and switch to `chainId` if necessary).

* [#582](https://github.com/tmm/wagmi/pull/582) [`b03830a`](https://github.com/tmm/wagmi/commit/b03830a54465215c2526f9509543fe2c978bfe70) Thanks [@jxom](https://github.com/jxom)! - Fixed an issue where the wagmi client's `status` would not update from `"disconnected"` to `"connecting" -> "connected"` when the `connect` action is invoked.

- [`fc94210`](https://github.com/tmm/wagmi/commit/fc94210b67daa91aa164625dfe189d5b6c2f92d4) Thanks [@jxom](https://github.com/jxom)! - Added a `multicall` & `watchMulticall` action that provides multicall support.

  Internally uses the [`multicall3` contract](https://github.com/mds1/multicall).

  [See example usage](https://github.com/tmm/wagmi/blob/194866032985fdd3f49bc46bf1b14181d7cb61d1/packages/core/src/actions/contracts/multicall.test.ts)

* [`fc94210`](https://github.com/tmm/wagmi/commit/fc94210b67daa91aa164625dfe189d5b6c2f92d4) Thanks [@jxom](https://github.com/jxom)! - Added a `readContracts` & `watchReadContracts` action that provides the ability to batch up multiple ethers Contract read-only methods.

## 0.3.8

### Patch Changes

- [#570](https://github.com/tmm/wagmi/pull/570) [`0e3fe15`](https://github.com/tmm/wagmi/commit/0e3fe15445377f35d6f4142b49bf1c96bfeb62cd) Thanks [@tmm](https://github.com/tmm)! - adds chain for [Foundry](https://github.com/foundry-rs)

## 0.3.7

### Patch Changes

- [#550](https://github.com/tmm/wagmi/pull/550) [`2a5313e`](https://github.com/tmm/wagmi/commit/2a5313e8cbc9ba6335e8e4b85e43862c9b711bd3) Thanks [@tmm](https://github.com/tmm)! - fix `CoinbaseWalletConnector` possible type error

* [#548](https://github.com/tmm/wagmi/pull/548) [`0c48719`](https://github.com/tmm/wagmi/commit/0c487199f2421f042abc1f1d139468ccbbc5646a) Thanks [@dohaki](https://github.com/dohaki)! - add ensAddress to Chain type

- [#549](https://github.com/tmm/wagmi/pull/549) [`89b3a74`](https://github.com/tmm/wagmi/commit/89b3a74ead4234daacd0dcf8506659887ebf0553) Thanks [@tmm](https://github.com/tmm)! - Turns on [`noUncheckedIndexedAccess`](https://www.typescriptlang.org/tsconfig#noUncheckedIndexedAccess=) and [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks=) for better runtime safety.

## 0.3.6

### Patch Changes

- [#526](https://github.com/tmm/wagmi/pull/526) [`e95c5f9`](https://github.com/tmm/wagmi/commit/e95c5f91859e57d079b962a72d06b93dce004d2f) Thanks [@jxom](https://github.com/jxom)! - Added `shimChainChangedDisconnect` option to `InjectedConnector`. Defaults to `true` for `MetaMaskConnector`.

* [#526](https://github.com/tmm/wagmi/pull/526) [`e95c5f9`](https://github.com/tmm/wagmi/commit/e95c5f91859e57d079b962a72d06b93dce004d2f) Thanks [@jxom](https://github.com/jxom)! - Added `lastUsedChainId` property to the wagmi `Client`.

- [#526](https://github.com/tmm/wagmi/pull/526) [`e95c5f9`](https://github.com/tmm/wagmi/commit/e95c5f91859e57d079b962a72d06b93dce004d2f) Thanks [@jxom](https://github.com/jxom)! - Added `chainId` config option to the `connect` action.

  Example:

  ```tsx
  import { connect } from '@wagmi/core'

  await connect({ chainId: 69 })
  ```

## 0.3.5

### Patch Changes

- [#543](https://github.com/tmm/wagmi/pull/543) [`4d489fd`](https://github.com/tmm/wagmi/commit/4d489fd630dd8c00440bdaf4d646de662c41ff52) Thanks [@tmm](https://github.com/tmm)! - fix fee data formatting for null values

## 0.3.4

### Patch Changes

- [`c4deb66`](https://github.com/tmm/wagmi/commit/c4deb6655a52e4cc4e5b3fd82202db11d6106848) Thanks [@jxom](https://github.com/jxom)! - infer `options.chainId` config from `chains` on WalletConnectConnector

## 0.3.3

### Patch Changes

- [#486](https://github.com/tmm/wagmi/pull/486) [`dbfe3dd`](https://github.com/tmm/wagmi/commit/dbfe3dd320d178d6854a8096101200c1508786bb) Thanks [@tmm](https://github.com/tmm)! - add chains entrypoint

## 0.3.2

### Patch Changes

- [`17212da`](https://github.com/tmm/wagmi/commit/17212da601640110d2835300e6433d1433db212e) Thanks [@jxom](https://github.com/jxom)! - Made the `defaultChains` type generic in `configureChains`.

## 0.3.1

### Patch Changes

- [#484](https://github.com/tmm/wagmi/pull/484) [`1b9a503`](https://github.com/tmm/wagmi/commit/1b9a5033d51c6655b4f6570c490da6e0e9a29da9) Thanks [@tmm](https://github.com/tmm)! - export React Context

## 0.3.0

### Minor Changes

- [#408](https://github.com/tmm/wagmi/pull/408) [`bfcc3a5`](https://github.com/tmm/wagmi/commit/bfcc3a51bbb1551753e3ccde6af134e9fd4fec9a) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** The `connectors` option on `createClient` no longer reacts to chain switching.

  **Passing a function to `connectors` has been deprecated.**

  If you previously derived an RPC URL from the `chainId` in `connectors`, you will need to migrate to use the [`configureChains` API](https://wagmi.sh/docs/providers/configuring-chains).

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

  const { chains } = configureChains(defaultChains, [
    alchemyProvider({ alchemyId }),
    publicProvider(),
  ])

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
  })
  ```

* [#468](https://github.com/tmm/wagmi/pull/468) [`44a884b`](https://github.com/tmm/wagmi/commit/44a884b84171c418f57701e80ef8de972948ef0b) Thanks [@tmm](https://github.com/tmm)! - **Breaking:** Duplicate exports with different names and the same functionality were removed to simplify the public API. In addition, confusing exports were renamed to be more descriptive.

  - `createWagmiClient` alias was removed. Use `createClient` instead.
  - `useWagmiClient` alias was removed. Use `useClient` instead.
  - `WagmiClient` alias was removed. Use `Client` instead.
  - `createWagmiStorage` alias was removed. Use `createStorage` instead.
  - `Provider` was renamed and `WagmiProvider` alias was removed. Use `WagmiConfig` instead.

- [#408](https://github.com/tmm/wagmi/pull/408) [`bfcc3a5`](https://github.com/tmm/wagmi/commit/bfcc3a51bbb1551753e3ccde6af134e9fd4fec9a) Thanks [@jxom](https://github.com/jxom)! - Add `configureChains` API.

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

- [#473](https://github.com/tmm/wagmi/pull/473) [`a54f3e2`](https://github.com/tmm/wagmi/commit/a54f3e23ea385ed8aa4ad188128d7089ba20f83e) Thanks [@cesargdm](https://github.com/cesargdm)! - Add workaround for CoinbaseWalletSDK import on esbuild

* [#447](https://github.com/tmm/wagmi/pull/447) [`b9ebf78`](https://github.com/tmm/wagmi/commit/b9ebf782e0900725bcb76483686b30f09d357ebd) Thanks [@tmm](https://github.com/tmm)! - Fix case where connector disconnected while app was closed and stale data was returned when autoconnecting. For example, [MetaMask was locked](https://github.com/tmm/wagmi/issues/444) when page was closed.

## 0.2.5

### Patch Changes

- [`4e03666`](https://github.com/tmm/wagmi/commit/4e03666428d42fc9186c617001b5eb356229677e) Thanks [@tmm](https://github.com/tmm)! - bump dependencies #429
  add imToken support for WC switch chains #432
  fix MetaMask and Brave Wallet collision #436

## 0.2.4

### Patch Changes

- [#421](https://github.com/tmm/wagmi/pull/421) [`a232b3f`](https://github.com/tmm/wagmi/commit/a232b3ff5cc41e882c4d2a34c599a8cb670edd2b) Thanks [@tmm](https://github.com/tmm)! - fix erc721 abi

## 0.2.3

### Patch Changes

- [#412](https://github.com/tmm/wagmi/pull/412) [`80bef4f`](https://github.com/tmm/wagmi/commit/80bef4ff3f714b0b8f896f1b4b658acc7266299b) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Import providers from `ethers` peer dependency rather than `@ethersproject/providers` to avoid multiple conflicting versions being installed

## 0.2.2

### Patch Changes

- [`018c2a1`](https://github.com/tmm/wagmi/commit/018c2a11b22ee513571cc7f83fd63f7eb169ee70) Thanks [@tmm](https://github.com/tmm)! - - warn and fallback to default client #380

  - remove signerOrProvider option from read contract #390

  - MetaMaskConnector #391

## 0.2.1

### Patch Changes

- [`afc4607`](https://github.com/tmm/wagmi/commit/afc46071e91601ab8a2b465524da796cd60b6ad4) Thanks [@tmm](https://github.com/tmm)! - - Fix time scaling e9593df
  - Use fully-specified path for use-sync-external-store import 7b235c1
  - Update serialize 236fc17

## 0.2.0

### Minor Changes

- [#311](https://github.com/tmm/wagmi/pull/311) [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d) Thanks [@tmm](https://github.com/tmm)! - don't persist account data when `autoConnect` is falsy

* [#311](https://github.com/tmm/wagmi/pull/311) [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d) Thanks [@tmm](https://github.com/tmm)! - - fix(@wagmi/core): persist connector chains to local storage

- [#311](https://github.com/tmm/wagmi/pull/311) [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d) Thanks [@tmm](https://github.com/tmm)! - - Favour `message` event over `connecting` event to conform to EIP-1193
  - Export `useWaitForTransaction`

* [#311](https://github.com/tmm/wagmi/pull/311) [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d) Thanks [@tmm](https://github.com/tmm)! - Initial 0.3.0 release

- [#311](https://github.com/tmm/wagmi/pull/311) [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d) Thanks [@tmm](https://github.com/tmm)! - Add `cacheOnBlock` config for `useContractRead`
  Update `react-query` to v4
  Fix `watchBlockNumber` listener leak

* [#311](https://github.com/tmm/wagmi/pull/311) [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d) Thanks [@tmm](https://github.com/tmm)! - add `connecting` event to connectors

- [#311](https://github.com/tmm/wagmi/pull/311) [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d) Thanks [@tmm](https://github.com/tmm)! - Fix issue where `getProvider` was not being awaited in `getSigner`

* [#311](https://github.com/tmm/wagmi/pull/311) [`24ce011`](https://github.com/tmm/wagmi/commit/24ce0113022b890e9582c6cc24035926e0d2b32d) Thanks [@tmm](https://github.com/tmm)! - - remove storage persistence of `connector`
  - add `chains` to client state

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

## 0.2.0-next.18

### Patch Changes

- showtime

## 0.2.0-next.17

### Patch Changes

- update block explorers and rpc urls structure

## 0.2.0-next.16

### Patch Changes

- last beta

## 0.2.0-next.15

### Patch Changes

- update zustand

## 0.2.0-next.14

### Minor Changes

- Add `cacheOnBlock` config for `useContractRead`
- Update `react-query` to v4
- Fix `watchBlockNumber` listener leak

## 0.2.0-next.13

### Patch Changes

- keep previous data when watching

## 0.2.0-next.12

### Patch Changes

- add chainId to actions and hooks

## 0.2.0-next.11

### Patch Changes

- fix stale connectors when switching chains

## 0.2.0-next.10

### Patch Changes

- republish

## 0.2.0-next.9

### Patch Changes

- improve type support for ethers providers

## 0.2.0-next.8

### Patch Changes

- update babel target

## 0.2.0-next.7

### Minor Changes

- - Favour `message` event over `connecting` event to conform to EIP-1193
  - Export `useWaitForTransaction`

## 0.2.0-next.6

### Minor Changes

- add `connecting` event to connectors

## 0.2.0-next.5

### Minor Changes

- don't persist account data when `autoConnect` is falsy

## 0.2.0-next.4

### Minor Changes

- remove storage persistence of `connector`
- add `chains` to client state

## 0.2.0-next.3

### Minor Changes

- Fix issue where `getProvider` was not being awaited in `getSigner`

## 0.2.0-next.2

### Minor Changes

- fix: persist connector chains to local storage

## 0.2.0-next.1

### Minor Changes

- Initial 0.3.0 release

## 0.1.22

### Patch Changes

- [`747d895`](https://github.com/tmm/wagmi/commit/747d895a54b562958afde34b1d34e81ab5039e2c) Thanks [@tmm](https://github.com/tmm)! - add warning to WalletLinkConnector

## 0.1.21

### Patch Changes

- [`c858c51`](https://github.com/tmm/wagmi/commit/c858c51b44d9039f1d0db5bcf016639f47d1931f) Thanks [@tmm](https://github.com/tmm)! - update coinbase connector

## 0.1.20

### Patch Changes

- [#326](https://github.com/tmm/wagmi/pull/326) [`36e6989`](https://github.com/tmm/wagmi/commit/36e69894f4c27aaad7fb6d678476c8bb870244bb) Thanks [@0xGabi](https://github.com/0xGabi)! - Add Gnosis Chain

## 0.1.19

### Patch Changes

- [`d467df6`](https://github.com/tmm/wagmi/commit/d467df6374210dbc4b016788b4beb4fded54cb4d) Thanks [@tmm](https://github.com/tmm)! - fix global type leaking

## 0.1.18

### Patch Changes

- [#294](https://github.com/tmm/wagmi/pull/294) [`1d253f3`](https://github.com/tmm/wagmi/commit/1d253f3a59b61d24c88d25c99decd84a6c734e5d) Thanks [@tmm](https://github.com/tmm)! - change babel target

## 0.1.17

### Patch Changes

- [#292](https://github.com/tmm/wagmi/pull/292) [`53c9be1`](https://github.com/tmm/wagmi/commit/53c9be17ee0c2ae6b8f34f2351b8858257b3f5f2) Thanks [@tmm](https://github.com/tmm)! - fix private fields

## 0.1.16

### Patch Changes

- [`79a2499`](https://github.com/tmm/wagmi/commit/79a249989029f818c32c0e84c0dd2c75e8aa990a) Thanks [@tmm](https://github.com/tmm)! - update build target to es2021

## 0.1.15

### Patch Changes

- [`f9790b5`](https://github.com/tmm/wagmi/commit/f9790b55600df09c77bb8ca349c5a3457df1b07c) Thanks [@tmm](https://github.com/tmm)! - fix WalletConnect issue

## 0.1.14

### Patch Changes

- [#236](https://github.com/tmm/wagmi/pull/236) [`53bad61`](https://github.com/tmm/wagmi/commit/53bad615788764e31121678083c382c1bd042fe8) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Updated `@walletconnect/ethereum-provider` to [v1.7.4](https://github.com/WalletConnect/walletconnect-monorepo/releases/tag/1.7.4)

## 0.1.13

### Patch Changes

- [`8e9412a`](https://github.com/tmm/wagmi/commit/8e9412af71958301ae2f9748febb936e79900aa0) Thanks [@tmm](https://github.com/tmm)! - bump walletlink

## 0.1.12

### Patch Changes

- [#210](https://github.com/tmm/wagmi/pull/210) [`684468a`](https://github.com/tmm/wagmi/commit/684468aee3e42a1ce2b4b599f3f17d1819213de8) Thanks [@tmm](https://github.com/tmm)! - update chains to match chainslist.org

## 0.1.11

### Patch Changes

- [#195](https://github.com/tmm/wagmi/pull/195) [`25b6083`](https://github.com/tmm/wagmi/commit/25b6083a662a0236794d1765343467691421c14b) Thanks [@tmm](https://github.com/tmm)! - rename wagmi-private to wagmi-core

## 0.1.10

### Patch Changes

- [#192](https://github.com/tmm/wagmi/pull/192) [`428cedb`](https://github.com/tmm/wagmi/commit/428cedb3dec4e3e4b9f4559c8e65932e05f94e05) Thanks [@tmm](https://github.com/tmm)! - rename core and testing packages

## 0.1.9

### Patch Changes

- [#190](https://github.com/tmm/wagmi/pull/190) [`7034bb8`](https://github.com/tmm/wagmi/commit/7034bb868412b9f481b206371280e84c2d52706d) Thanks [@tmm](https://github.com/tmm)! - add shim for metamask chain changed to prevent disconnect

## 0.1.8

### Patch Changes

- [#137](https://github.com/tmm/wagmi/pull/137) [`dceeb43`](https://github.com/tmm/wagmi/commit/dceeb430d9021fbf98366859cb1cd0149e80c55c) Thanks [@tmm](https://github.com/tmm)! - add siwe guide

## 0.1.7

### Patch Changes

- [#127](https://github.com/tmm/wagmi/pull/127) [`f05b031`](https://github.com/tmm/wagmi/commit/f05b0310f7f7e6447e9b6c81cedbb27dcf2f3649) Thanks [@tmm](https://github.com/tmm)! - update switch chain return type

## 0.1.6

### Patch Changes

- [`1412eed`](https://github.com/tmm/wagmi/commit/1412eed0d1494bb4f8c6845a0e890f79e4e68e03) Thanks [@tmm](https://github.com/tmm)! - add frame to injected

## 0.1.5

### Patch Changes

- [`e338c3b`](https://github.com/tmm/wagmi/commit/e338c3b6cc255742be6a67593aa5da6c17e90fbd) Thanks [@tmm](https://github.com/tmm)! - checksum connector address on change events

  add shim to injected connector for simulating disconnect

## 0.1.4

### Patch Changes

- [`0176c4e`](https://github.com/tmm/wagmi/commit/0176c4e83fb0c5f159c3c802a1da3d6deb2184ae) Thanks [@tmm](https://github.com/tmm)! - added switchChain to WalletConnect and WalletLink connectors

## 0.1.3

### Patch Changes

- [`071d7fb`](https://github.com/tmm/wagmi/commit/071d7fbca35ec4832700b5343661ceb2dae20598) Thanks [@tmm](https://github.com/tmm)! - add hardhat chain

## 0.1.2

### Patch Changes

- [`78bade9`](https://github.com/tmm/wagmi/commit/78bade9d0da97ab38a7e6594c34e3841ec1c8fe6) Thanks [@tmm](https://github.com/tmm)! - add type definitions

## 0.1.1

### Patch Changes

- [#56](https://github.com/tmm/wagmi/pull/56) [`2ebfd8e`](https://github.com/tmm/wagmi/commit/2ebfd8e85b560f25cd46cff04619c84643cab297) Thanks [@tmm](https://github.com/tmm)! - add chain support status

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

## 0.0.17

### Patch Changes

- [#25](https://github.com/tmm/wagmi/pull/25) [`9a7dab7`](https://github.com/tmm/wagmi/commit/9a7dab78b3518658bc7d85dc397990f0d28da175) Thanks [@tmm](https://github.com/tmm)! - update response types

## 0.0.16

### Patch Changes

- [`d1574cf`](https://github.com/tmm/wagmi/commit/d1574cf5f7a578ccd480889c2e375134145a4aba) Thanks [@tmm](https://github.com/tmm)! - add better type information for contract results

## 0.0.15

### Patch Changes

- [`3909624`](https://github.com/tmm/wagmi/commit/39096249c1fa9516beabb11735beb67c94032879) Thanks [@tmm](https://github.com/tmm)! - make contract read and write execute overrides param optional

## 0.0.14

### Patch Changes

- [`63312e2`](https://github.com/tmm/wagmi/commit/63312e2b06b8d835abc2908cba399d941ca79408) Thanks [@tmm](https://github.com/tmm)! - add once to contract event

## 0.0.13

### Patch Changes

- [`6f890b0`](https://github.com/tmm/wagmi/commit/6f890b0dabbdbea913ec91cb8bfc970c05ed0a93) Thanks [@tmm](https://github.com/tmm)! - update readme

## 0.0.12

### Patch Changes

- [#19](https://github.com/tmm/wagmi/pull/19) [`7bc1c47`](https://github.com/tmm/wagmi/commit/7bc1c47875e9ef24e9c79cfafc6b23e7a838b5bc) Thanks [@tmm](https://github.com/tmm)! - remove console log from walletlink connector

## 0.0.11

### Patch Changes

- [#17](https://github.com/tmm/wagmi/pull/17) [`571648b`](https://github.com/tmm/wagmi/commit/571648b754f7f538536bafc9387bd3104657ea49) Thanks [@tmm](https://github.com/tmm)! - standardize connector provider

## 0.0.10

### Patch Changes

- [#15](https://github.com/tmm/wagmi/pull/15) [`5f7675c`](https://github.com/tmm/wagmi/commit/5f7675c3ffd848522d4117c07c1f62b17dfc6616) Thanks [@tmm](https://github.com/tmm)! - read and write contract functions

## 0.0.9

### Patch Changes

- [#13](https://github.com/tmm/wagmi/pull/13) [`e5545f5`](https://github.com/tmm/wagmi/commit/e5545f5565cf0bbf5e62ec7ccab3051705b1d313) Thanks [@tmm](https://github.com/tmm)! - add testing package

## 0.0.8

### Patch Changes

- [`5332500`](https://github.com/tmm/wagmi/commit/5332500918ac240d29ffe4d2aed8566a8ac001e4) Thanks [@tmm](https://github.com/tmm)! - update signing

## 0.0.7

### Patch Changes

- [`0bff89a`](https://github.com/tmm/wagmi/commit/0bff89ab2ad28b2cb9b346d1ac870e859d9278bc) Thanks [@tmm](https://github.com/tmm)! - update injected connector

## 0.0.6

### Patch Changes

- [`37d39d1`](https://github.com/tmm/wagmi/commit/37d39d174ddfa122462bbe2d02141cd61eb9db4a) Thanks [@tmm](https://github.com/tmm)! - add message signing

## 0.0.5

### Patch Changes

- [`d7d94f0`](https://github.com/tmm/wagmi/commit/d7d94f06f7d30468e5e39d64db63124c6315cf82) Thanks [@tmm](https://github.com/tmm)! - fix injected connector name

## 0.0.4

### Patch Changes

- [`29fbe29`](https://github.com/tmm/wagmi/commit/29fbe2920046b9e87a34faa04500ccf3c4f83748) Thanks [@tmm](https://github.com/tmm)! - fix external deps

## 0.0.3

### Patch Changes

- [#6](https://github.com/tmm/wagmi/pull/6) [`8dc3a5d`](https://github.com/tmm/wagmi/commit/8dc3a5d5f418813b09663534fe585d9bcf94dbeb) Thanks [@tmm](https://github.com/tmm)! - clean up deps

## 0.0.2

### Patch Changes

- [#4](https://github.com/tmm/wagmi/pull/4) [`2fbd821`](https://github.com/tmm/wagmi/commit/2fbd8216379bd03c9cc5c06b10b75637e75cb7d8) Thanks [@tmm](https://github.com/tmm)! - init changesets
