import * as React from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import {
  DehydratedState,
  dehydrate,
  extractState,
  prefetchEnsName,
} from 'wagmi'

import { Account, Connect, NetworkSwitcher } from '../components'
import { client } from '../wagmi'

type ServerProps = {
  dehydratedState: DehydratedState
}

export const getServerSideProps: GetServerSideProps<ServerProps> = async ({
  req,
}) => {
  const state = extractState(client, req)
  if (state.account)
    await prefetchEnsName(client, { address: state.account, chainId: 1 })

  return {
    props: {
      dehydratedState: dehydrate(client, state),
    },
  }
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const Page = (_props: Props) => {
  return (
    <>
      <Connect />
      <Account />
      <NetworkSwitcher />
    </>
  )
}

export default Page
