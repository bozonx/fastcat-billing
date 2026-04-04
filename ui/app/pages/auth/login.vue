<script setup lang="ts">
const { fetchApi } = useApi()
const { setAuth } = useAuth()
const toast = useToast()

const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    const res = await fetchApi('/auth/login', {
      method: 'POST',
      body: form
    })
    
    setAuth(res.token, res.user)
    toast.add({ title: 'Success', description: 'Welcome back!', color: 'success' })
    navigateTo('/')
  } catch (err: any) {
    toast.add({ 
      title: 'Login failed', 
      description: err.data?.error || 'Unknown error', 
      color: 'error' 
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-neutral-950 p-4">
    <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
    
    <div class="w-full max-w-md relative z-10">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold tracking-tight text-white mb-2">FastCat Billing</h1>
        <p class="text-neutral-400">Sign in to manage your credits and AI APIs</p>
      </div>

      <UCard class="border-neutral-800 bg-neutral-900/50 backdrop-blur-xl shadow-2xl">
        <form @submit.prevent="handleLogin" class="space-y-6 py-4">
          <UFormField label="Email" name="email">
            <UInput 
              v-model="form.email" 
              placeholder="ivan@fastcat.tech" 
              icon="i-lucide-mail" 
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Password" name="password">
            <template #label="{ label, name }">
              <div class="flex justify-between items-center w-full">
                <span>{{ label }}</span>
                <NuxtLink to="/auth/forgot" class="text-xs text-indigo-400 hover:text-indigo-300">Forgot password?</NuxtLink>
              </div>
            </template>
            <UInput 
              v-model="form.password" 
              type="password" 
              placeholder="••••••••" 
              icon="i-lucide-lock" 
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UButton 
            type="submit" 
            block 
            size="lg" 
            color="primary" 
            :loading="loading"
            class="rounded-xl shadow-lg shadow-indigo-500/20"
          >
            Sign In
          </UButton>
        </form>

        <template #footer>
          <p class="text-center text-sm text-neutral-400">
            Don't have an account? 
            <NuxtLink to="/auth/register" class="text-indigo-400 font-semibold hover:text-indigo-300">Create one</NuxtLink>
          </p>
        </template>
      </UCard>
    </div>
  </div>
</template>
