import * as React from 'react'
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

import { useIsMounted } from '../hooks'
import { Balance } from './Balance'
import { BlockNumber } from './BlockNumber'
import { ReadContract } from './ReadContract'
import { SendTransaction } from './SendTransaction'
import { SignMessage } from './SignMessage'
import { Token } from './Token'
import { WriteContract } from './WriteContract'

export const Account = () => {
  const isMounted = useIsMounted()
  const account = useAccount({
    onConnect: (data) => console.log('connected', data),
    onDisconnect: () => console.log('disconnected'),
  })
  const ensAvatar = useEnsAvatar({
    addressOrName: account?.address,
    chainId: 1,
  })
  const ensName = useEnsName({ address: account?.address, chainId: 1 })
  const disconnect = useDisconnect()

  return (
    <div>
      <div>{account.address}</div>
      <div>{ensName.data}</div>
      {account?.address && (
        <button onClick={() => disconnect.disconnect()}>Disconnect</button>
      )}
      {/* <div>
        {ensName.data ?? account?.address}
        {ensName.data ? ` (${account?.address})` : null}
      </div>

      {ensAvatar.data && (
        <img src={ensAvatar.data} style={{ height: 40, width: 40 }} />
      )}

      <div>
        {account?.address && (
          <button onClick={() => disconnect.disconnect()}>Disconnect</button>
        )}
        {isMounted && account?.connector?.name && (
          <span>Connected to {account.connector.name}</span>
        )}
      </div> */}

      {/* {true && (
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
      )} */}
    </div>
  )
}
