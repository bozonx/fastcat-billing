export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const { token, logout } = useAuth()

  const fetchApi = (path: string, options: any = {}) => {
    const headers: Record<string, string> = {
      ...options.headers
    }

    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }

    return $fetch(path, {
      baseURL: apiBase,
      headers,
      ...options,
      async onResponseError({ response }) {
        if (response.status === 401) {
          // Если токен протух или невалиден
          console.warn('Unauthorized request, logging out...')
          logout()
        }
      }
    })
  }

  return {
    fetchApi
  }
}
