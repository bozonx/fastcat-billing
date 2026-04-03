export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  const fetchApi = (path: string, options: any = {}) => {
    return $fetch(path, {
      baseURL: apiBase,
      headers: {
        'X-API-Key': 'DEMO_KEY', // For now
        ...options.headers
      },
      ...options
    })
  }

  return {
    fetchApi
  }
}
