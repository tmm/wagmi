import { FetchEnsAvatarResult, fetchEnsAvatar } from '@wagmi/core'

import { QueryConfig, QueryFunctionArgs } from '../../types'
import { useChainId, useQuery } from '../utils'

export type UseEnsAvatarArgs = {
  /** Address or ENS name */
  addressOrName?: string
}

export type UseEnsLookupConfig = QueryConfig<FetchEnsAvatarResult, Error>

export const queryKey = ({
  addressOrName,
  chainId,
}: {
  addressOrName?: UseEnsAvatarArgs['addressOrName']
  chainId?: number
}) => [{ entity: 'ensAvatar', addressOrName, chainId }] as const

const queryFn = ({
  queryKey: [{ addressOrName }],
}: QueryFunctionArgs<typeof queryKey>) => {
  if (!addressOrName) throw new Error('addressOrName is required')
  return fetchEnsAvatar({ addressOrName })
}

export function useEnsAvatar({
  addressOrName,
  cacheTime,
  enabled = true,
  staleTime = 60 * 60 * 24, // 24 hours
  suspense,
  onError,
  onSettled,
  onSuccess,
}: UseEnsAvatarArgs & UseEnsLookupConfig = {}) {
  const chainId = useChainId()
  return useQuery(queryKey({ addressOrName, chainId }), queryFn, {
    cacheTime,
    enabled: Boolean(enabled && addressOrName && chainId),
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })
}
