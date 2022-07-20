import * as React from 'react'
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

import { useIsMounted } from '../hooks'
import { Balance } from './Balance'
import { BlockNumber } from './BlockNumber'
import { ReadContract } from './ReadContract'
import { ReadContracts } from './ReadContracts'
import { SendTransaction } from './SendTransaction'
import { SignMessage } from './SignMessage'
import { Token } from './Token'
import { WriteContract } from './WriteContract'

export const Account = () => {
  const isMounted = useIsMounted()
  const { address, connector } = useAccount({
    onConnect: (data) => console.log('connected', data),
    onDisconnect: () => console.log('disconnected'),
  })
  const { data: ensAvatar } = useEnsAvatar({
    addressOrName: address,
    chainId: 1,
  })
  const { data: ensName } = useEnsName({
    address,
    chainId: 1,
  })
  const { disconnect } = useDisconnect()

  return (
    <div>
      <div>
        {ensName ?? address}
        {ensName ? ` (${address})` : null}
      </div>

      {ensAvatar && <img src={ensAvatar} style={{ height: 40, width: 40 }} />}

      <div>
        {address && <button onClick={() => disconnect()}>Disconnect</button>}
        {isMounted && connector?.name && (
          <span>Connected to {connector.name}</span>
        )}
      </div>

      {false && (
        <>
          {true && (
            <>
              <h4>Balance</h4>
              <Balance />

              <h4>Block Number</h4>
              <BlockNumber />

              <h4>Send Transaction</h4>
              <SendTransaction />
            </>
          )}

          <h4>Read Contract</h4>
          <ReadContract />

          <h4>Read Contracts</h4>
          <ReadContracts />

          <h4>Write Contract</h4>
          <WriteContract />

          {false && (
            <>
              <h4>Sign Message</h4>
              <SignMessage />

              <h4>Token</h4>
              <Token />
            </>
          )}
        </>
      )}
    </div>
  )
}
