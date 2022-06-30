export function parseCookie(cookie?: string) {
  if (!cookie || cookie.length === 0) return {}

  const cookies = cookie.split('; ')

  const result: { [key: string]: string | undefined } = {}
  for (let i = 0; i < cookies.length; i++) {
    const parts = cookies[i]?.split('=')

    try {
      const key = decodeURIComponent(parts?.[0] ?? '')

      let value = parts?.slice(1).join('=')
      if (value?.[0] === '"') {
        value = value.slice(1, -1)
      }
      if (key.includes('wagmi.')) {
        result[key] = value?.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
      }
      // eslint-disable-next-line no-empty
    } catch {}
  }

  return result
}
