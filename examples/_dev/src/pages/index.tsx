import * as React from 'react'
import { GetServerSidePropsContext } from 'next'

// TODO(jxom): fix
import { getSsrData } from '../../../../packages/react/server'

import { Account, Connect, NetworkSwitcher } from '../components'

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return {
    props: {
      wagmiSsr: getSsrData(ctx.req),
    },
  }
}

const Page = (props) => {
  return (
    <>
      <Connect />
      <Account />
      <NetworkSwitcher />
    </>
  )
}

export default Page
