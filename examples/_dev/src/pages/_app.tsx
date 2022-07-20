import * as React from 'react'
import NextHead from 'next/head'
import { type AppProps } from 'next/app'
import { Hydrate, WagmiConfig } from 'wagmi'

import { client } from '../wagmi'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <NextHead>
        <title>wagmi</title>
      </NextHead>

      <WagmiConfig client={client}>
        <Hydrate state={pageProps.dehydratedState}>
          <Component {...pageProps} />
        </Hydrate>
      </WagmiConfig>
    </>
  )
}

export default App
