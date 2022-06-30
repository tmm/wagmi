import * as React from 'react'
import type { AppProps } from 'next/app'
import NextHead from 'next/head'
import {
  Chain,
  WagmiConfig,
  chain,
  configureChains,
  createClient,
  createStorage,
  defaultChains,
  ssrStorage,
} from 'wagmi'

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID
const infuraId = process.env.NEXT_PUBLIC_INFURA_ID

const avalanche: Chain = {
  id: 43_114,
  name: 'Avalanche',
  network: 'avalanche',
  nativeCurrency: {
    decimals: 18,
    name: 'Avalanche',
    symbol: 'AVAX',
  },
  rpcUrls: {
    default: 'https://api.avax.network/ext/bc/C/rpc',
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://snowtrace.io' },
  },
  testnet: false,
}

const { chains, provider, webSocketProvider } = configureChains(
  [...defaultChains, chain.optimism, avalanche],
  [
    alchemyProvider({ alchemyId }),
    infuraProvider({ infuraId }),
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== avalanche.id) return null
        return {
          http: chain.rpcUrls.default,
        }
      },
    }),
    publicProvider(),
  ],
  { targetQuorum: 1 },
)

const client = createClient({
  autoConnect: true,
  ssrStorage: createStorage({ storage: ssrStorage }),
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
        name: (detectedName) =>
          `Injected (${
            typeof detectedName === 'string'
              ? detectedName
              : detectedName.join(', ')
          })`,
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
})

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <NextHead>
        <title>wagmi</title>
      </NextHead>

      <WagmiConfig client={client} ssrData={pageProps.wagmiSsr}>
        <Component {...pageProps} />
      </WagmiConfig>
    </>
  )
}

export default App
