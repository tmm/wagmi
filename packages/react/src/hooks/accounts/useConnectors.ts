import { useClient } from '../../context'

export function useConnectors() {
  const client = useClient()
  return client.connectors
}
