import {
  Chain,
  chain,
  configureChains,
  createClient,
  createStorage,
  defaultChains,
} from 'wagmi'
import cookie from 'js-cookie'

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'

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
  multicall: {
    address: '0xca11bde05977b3631167028862be2a173976ca11',
    blockCreated: 11907934,
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://snowtrace.io' },
  },
  testnet: false,
}

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID
const infuraId = process.env.NEXT_PUBLIC_INFURA_ID

export const { chains, provider, webSocketProvider } = configureChains(
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

export const connectors = [
  new MetaMaskConnector({
    chains,
    options: {
      UNSTABLE_shimOnConnectSelectAccount: true,
    },
  }),
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
      name: 'Browser Wallet',
      shimDisconnect: true,
    },
  }),
]

export const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  storage: createStorage({
    storage: {
      getItem: cookie.get,
      setItem: cookie.set,
      removeItem: cookie.remove,
    },
  }),
  webSocketProvider,
})
