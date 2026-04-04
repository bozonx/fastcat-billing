export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth()

  // Исключаем страницы авторизации из проверки
  if (to.path.startsWith('/auth')) {
    return
  }

  // Если не авторизован - на логин
  if (!isAuthenticated.value) {
    return navigateTo('/auth/login')
  }
})
