export type BaseStorage = {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

export type ClientStorage = {
  getKey: (
    key: string,
    keyDeps?: (string | number | undefined)[],
    { includePrefix }?: { includePrefix?: boolean },
  ) => string
  getItem: <T>(
    key: string,
    keyDeps?: (string | number | undefined)[],
    defaultValue?: string,
  ) => T | null
  setItem: <T>(
    key: string,
    value: T | null,
    keyDeps?: (string | number | undefined)[],
  ) => void
  removeItem: (key: string, keyDeps?: (string | number | undefined)[]) => void
}

export const noopStorage: BaseStorage = {
  getItem: (_key) => '',
  setItem: (_key, _value) => null,
  removeItem: (_key) => null,
}

export function createStorage({
  serialize = JSON.stringify,
  deserialize = JSON.parse,
  storage,
  key: prefix = 'wagmi',
}: {
  deserialize?: (value: string) => any
  serialize?: (value: any) => string
  storage: BaseStorage
  key?: string
}): ClientStorage {
  const getKey = (
    key: string,
    keyDeps?: (string | number | undefined)[],
    { includePrefix = true }: { includePrefix?: boolean } = {},
  ) => {
    const key_ = keyDeps ? `${key}.${keyDeps.join('.')}` : key
    return `${includePrefix ? `${prefix}.` : ''}${key_}`
  }
  return {
    ...storage,
    getKey,
    getItem: (key, keyDeps) => {
      const value = storage.getItem(getKey(key, keyDeps))
      try {
        return value ? deserialize(value) : null
      } catch (error) {
        console.warn(error)
        return null
      }
    },
    setItem: (key, value, keyDeps) => {
      if (value === null) {
        storage.removeItem(getKey(key, keyDeps))
      } else {
        try {
          storage.setItem(getKey(key, keyDeps), serialize(value))
        } catch (err) {
          console.error(err)
        }
      }
    },
    removeItem: (key, keyDeps) => {
      storage.removeItem(getKey(key, keyDeps))
    },
  }
}
