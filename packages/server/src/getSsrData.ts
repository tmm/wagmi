import { SSRData } from '@wagmi/core'

import { IncomingMessage } from 'http'

import { parseCookie } from './utils/parseCookie'

export function getSsrData(req: IncomingMessage): SSRData {
  return { cookies: parseCookie(req.headers.cookie) }
}
