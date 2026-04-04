<script setup lang="ts">
const { fetchApi } = useApi()
const { setAuth } = useAuth()
const toast = useToast()

const form = reactive({
  name: '',
  email: '',
  password: ''
})

const loading = ref(false)

const handleRegister = async () => {
  loading.value = true
  try {
    const res = await fetchApi('/auth/register', {
      method: 'POST',
      body: form
    })
    
    setAuth(res.token, res.user)
    toast.add({ title: 'Success', description: 'Account created! Here is $10 to get started.', color: 'success' })
    navigateTo('/')
  } catch (err: any) {
    toast.add({ 
      title: 'Registration failed', 
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
        <h1 class="text-4xl font-bold tracking-tight text-white mb-2">Join FastCat</h1>
        <p class="text-neutral-400">Start your journey with $10 free credits!</p>
      </div>

      <UCard class="border-neutral-800 bg-neutral-900/50 backdrop-blur-xl shadow-2xl">
        <form @submit.prevent="handleRegister" class="space-y-6 py-4">
          <UFormField label="Full Name" name="name">
            <UInput 
              v-model="form.name" 
              placeholder="Ivan Ivanov" 
              icon="i-lucide-user" 
              size="lg"
              class="w-full"
            />
          </UFormField>

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
            Create Account
          </UButton>
        </form>

        <template #footer>
          <p class="text-center text-sm text-neutral-400">
            Already have an account? 
            <NuxtLink to="/auth/login" class="text-indigo-400 font-semibold hover:text-indigo-300">Sign in instead</NuxtLink>
          </p>
        </template>
      </UCard>
      
      <div class="mt-8 text-center text-xs text-neutral-500">
        By signing up, you agree to our 
        <NuxtLink to="#" class="underline">Terms of Service</NuxtLink> 
        and 
        <NuxtLink to="#" class="underline">Privacy Policy</NuxtLink>.
      </div>
    </div>
  </div>
</template>
