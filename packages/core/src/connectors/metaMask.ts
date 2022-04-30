import { Chain } from '../types'
import { InjectedConnector, InjectedConnectorOptions } from './injected'

export type MetaMaskConnectorOptions = Pick<
  InjectedConnectorOptions,
  'shimDisconnect'
>

export class MetaMaskConnector extends InjectedConnector {
  readonly id = 'metaMask'
  readonly ready =
    typeof window != 'undefined' && !!this.#findProvider(window.ethereum)

  #provider?: Window['ethereum']

  constructor(config?: {
    chains?: Chain[]
    options?: MetaMaskConnectorOptions
  }) {
    super({
      ...config,
      options: {
        name: 'MetaMask',
        shimDisconnect: true,
        ...config?.options,
      },
    })
  }

  async getProvider() {
    if (typeof window !== 'undefined')
      this.#provider = this.#findProvider(window.ethereum)
    return this.#provider
  }

  #getReady(ethereum?: Ethereum) {
    if (
      !!ethereum?.isMetaMask &&
      (!!ethereum._events?.connect || !!ethereum._state)
    )
      return ethereum
  }

  #findProvider(ethereum?: Ethereum) {
    if (ethereum?.providers) return ethereum.providers.find(this.#getReady)
    return this.#getReady(ethereum)
  }
}
