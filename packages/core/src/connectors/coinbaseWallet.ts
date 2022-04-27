import type { ExternalProvider } from '@ethersproject/providers'
import { providers } from 'ethers'
import type {
  CoinbaseWalletProvider,
  CoinbaseWalletSDK,
} from '@coinbase/wallet-sdk'
import type { CoinbaseWalletSDKOptions } from '@coinbase/wallet-sdk/dist/CoinbaseWalletSDK'
import { AddressString } from '@coinbase/wallet-sdk/dist/types'
import { getAddress, hexValue } from 'ethers/lib/utils'

import { allChains } from '../constants'
import {
  AddChainError,
  ChainNotConfiguredError,
  SwitchChainError,
  UserRejectedRequestError,
} from '../errors'
import { Chain } from '../types'
import { normalizeChainId } from '../utils'
import { Connector } from './base'

type Options = CoinbaseWalletSDKOptions & {
  /**
   * Fallback Ethereum JSON RPC URL
   * @default ""
   */
  jsonRpcUrl?: string
  /**
   * Fallback Ethereum Chain ID
   * @default 1
   */
  chainId?: number
}

export class CoinbaseWalletConnector extends Connector<
  CoinbaseWalletProvider,
  Options,
  AddressString[]
> {
  readonly id = 'coinbaseWallet'
  readonly name = 'Coinbase Wallet'
  readonly ready =
    typeof window !== 'undefined' && !window.ethereum?.isCoinbaseWallet

  #client?: CoinbaseWalletSDK
  #provider?: CoinbaseWalletProvider

  constructor(config: { chains?: Chain[]; options: Options }) {
    super(config)
  }

  async connect() {
    try {
      this.emit('message', { type: 'connecting' })

      const { accounts, provider } = await this.enable()

      const account = getAddress(accounts[0])
      const id = await this.getChainId()
      const unsupported = this.isChainUnsupported(id)
      return {
        account,
        chain: { id, unsupported },
        provider: new providers.Web3Provider(
          <ExternalProvider>(<unknown>provider),
        ),
      }
    } catch (error) {
      if (/user closed modal/i.test((<ProviderRpcError>error).message))
        throw new UserRejectedRequestError()
      throw error
    }
  }

  async disconnect() {
    if (!this.#provider) return

    await this.disable()

    const provider = await this.getProvider()
    provider.disconnect()
    provider.close()

    if (typeof localStorage !== 'undefined') {
      let n = localStorage.length
      while (n--) {
        const key = localStorage.key(n)
        if (!key) continue
        if (!/-walletlink/.test(key)) continue
        localStorage.removeItem(key)
      }
    }
  }

  async disable() {
    const provider = await this.getProvider()
    provider.removeListener('accountsChanged', this.onAccountsChanged)
    provider.removeListener('chainChanged', this.onChainChanged)
    provider.removeListener('disconnect', this.onDisconnect)
  }

  async enable() {
    const provider = await this.getProvider()

    provider.on('accountsChanged', this.onAccountsChanged)
    provider.on('chainChanged', this.onChainChanged)
    provider.on('disconnect', this.onDisconnect)

    const accounts = await provider.enable()

    return { accounts, provider }
  }

  async getAccount() {
    const provider = await this.getProvider()
    const accounts = await provider.request<string[]>({
      method: 'eth_accounts',
    })
    // return checksum address
    return getAddress(accounts[0])
  }

  async getChainId() {
    const provider = await this.getProvider()
    const chainId = normalizeChainId(provider.chainId)
    return chainId
  }

  async getProvider() {
    if (!this.#provider) {
      const { CoinbaseWalletSDK } = await import('@coinbase/wallet-sdk')
      this.#client = new CoinbaseWalletSDK(this.options)
      this.#provider = this.#client.makeWeb3Provider(
        this.options.jsonRpcUrl,
        this.options.chainId,
      )
    }
    return this.#provider
  }

  async getSigner() {
    const [provider, account] = await Promise.all([
      this.getProvider(),
      this.getAccount(),
    ])
    return new providers.Web3Provider(
      <ExternalProvider>(<unknown>provider),
    ).getSigner(account)
  }

  async isAuthorized() {
    try {
      const account = await this.getAccount()
      return !!account
    } catch {
      return false
    }
  }

  async switchChain(chainId: number) {
    const provider = await this.getProvider()
    const id = hexValue(chainId)

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: id }],
      })
      const chains = [...this.chains, ...allChains]
      return (
        chains.find((x) => x.id === chainId) ?? {
          id: chainId,
          name: `Chain ${id}`,
          rpcUrls: { default: '' },
        }
      )
    } catch (error) {
      // Indicates chain is not added to provider
      if ((<ProviderRpcError>error).code === 4902) {
        try {
          const chain = this.chains.find((x) => x.id === chainId)
          if (!chain) throw new ChainNotConfiguredError()
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: id,
                chainName: chain.name,
                nativeCurrency: chain.nativeCurrency,
                rpcUrls: this.getRpcUrls(chain),
                blockExplorerUrls: this.getBlockExplorerUrls(chain),
              },
            ],
          })
          return chain
        } catch (addError) {
          throw new AddChainError()
        }
      } else if ((<ProviderRpcError>error).code === 4001)
        throw new UserRejectedRequestError()
      else throw new SwitchChainError()
    }
  }

  async watchAsset({
    address,
    decimals = 18,
    image,
    symbol,
  }: {
    address: string
    decimals?: number
    image?: string
    symbol: string
  }) {
    const provider = await this.getProvider()
    return await provider.request<boolean>({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address,
          decimals,
          image,
          symbol,
        },
      },
    })
  }

  protected onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) this.emit('disconnect')
    else this.emit('change', { account: getAddress(accounts[0]) })
  }

  protected onChainChanged = (chainId: number | string) => {
    const id = normalizeChainId(chainId)
    const unsupported = this.isChainUnsupported(id)
    this.emit('change', { chain: { id, unsupported } })
  }

  protected onDisconnect = () => {
    this.emit('disconnect')
  }
}
