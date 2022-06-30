import { FetchEnsNameArgs, FetchEnsNameResult, fetchEnsName } from '@wagmi/core'

import { useClient } from '../../context'

import { QueryConfig, QueryFunctionArgs } from '../../types'
import { useChainId, useQuery } from '../utils'

export type UseEnsNameArgs = Partial<FetchEnsNameArgs>

export type UseEnsNameConfig = QueryConfig<FetchEnsNameResult, Error>

export const queryKey = ({
  address,
  chainId,
}: {
  address?: string
  chainId?: number
}) => [{ entity: 'ensName', address, chainId }] as const

const queryFn = ({
  queryKey: [{ address, chainId }],
}: QueryFunctionArgs<typeof queryKey>) => {
  if (!address) throw new Error('address is required')
  return fetchEnsName({ address, chainId })
}

export function useEnsName({
  address,
  cacheTime,
  chainId: chainId_,
  enabled = true,
  staleTime = 1_000 * 60 * 60 * 24, // 24 hours
  suspense,
  onError,
  onSettled,
  onSuccess,
}: UseEnsNameArgs & UseEnsNameConfig = {}) {
  const client = useClient()
  const chainId = useChainId({ chainId: chainId_ })

  const ensNameCookie = client.ssrStorage?.getItem<
    Awaited<ReturnType<typeof queryFn>>
  >('ensName', [address, chainId])

  return useQuery(queryKey({ address, chainId }), queryFn, {
    cacheTime,
    enabled: Boolean(enabled && address && chainId),
    initialData: ensNameCookie,
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess: (data) => {
      client.ssrStorage?.setItem('ensName', data, [address, chainId])
      onSuccess?.(data)
    },
  })
}
