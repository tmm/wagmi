type BaseStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

export type ClientStorage = {
  deserialize: (value: string) => any
  serialize: (value: any) => string
  getItem: <T>(key: string, defaultState?: T | null) => T | null
  getKey: (
    key: string,
    keyDeps?: (string | number | undefined)[],
    { includePrefix }?: { includePrefix?: boolean },
  ) => string
  removeItem: (key: string) => void
  setItem: <T>(key: string, value: T | null) => void
}

type CreateStorageConfig = {
  deserialize?: (value: string) => any
  serialize?: (value: any) => string
  storage: BaseStorage
  key?: string
}

export function createStorage({
  deserialize = JSON.parse,
  serialize = JSON.stringify,
  storage,
  key: prefix = 'wagmi',
}: CreateStorageConfig): ClientStorage {
  const getKey = (key: string) => `${prefix}.${key}`

  return {
    ...storage,
    deserialize,
    serialize,
    getKey,
    getItem(key, defaultState = null) {
      const value = storage.getItem(getKey(key))
      try {
        return value ? deserialize(value) : defaultState
      } catch (error) {
        console.warn(error)
        return defaultState
      }
    },
    setItem(key, value) {
      if (value === null) {
        storage.removeItem(getKey(key))
      } else {
        try {
          storage.setItem(getKey(key), serialize(value))
        } catch (err) {
          console.error(err)
        }
      }
    },
    removeItem(key) {
      storage.removeItem(getKey(key))
    },
  }
}

export const noopStorage: BaseStorage = {
  getItem: (_key) => '',
  setItem: (_key, _value) => null,
  removeItem: (_key) => null,
}
