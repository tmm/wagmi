import { chain, defaultChains } from '../constants'
import { CoinbaseWalletConnector } from './coinbaseWallet'

describe('CoinbaseWalletConnector', () => {
  it('inits', () => {
    const connector = new CoinbaseWalletConnector({
      chains: defaultChains,
      options: {
        appName: 'wagmi',
        jsonRpcUrl: `${chain.hardhat.rpcUrls[0]}`,
      },
    })
    expect(connector.name).toEqual('Coinbase Wallet')
  })
})
