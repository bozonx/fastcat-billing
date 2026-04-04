export const useAuth = () => {
  const user = useState<any>('user', () => null)
  const token = useState<string | null>('auth_token', () => null)

  // Инициализация при загрузке (только на клиенте)
  onMounted(() => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')
    if (savedToken) {
      token.value = savedToken
    }
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  })

  const setAuth = (newToken: string, newUser: any) => {
    token.value = newToken
    user.value = newUser
    localStorage.setItem('auth_token', newToken)
    localStorage.setItem('auth_user', JSON.stringify(newUser))
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    navigateTo('/auth/login')
  }

  return {
    user,
    token,
    setAuth,
    logout,
    isAuthenticated: computed(() => !!token.value)
  }
}
