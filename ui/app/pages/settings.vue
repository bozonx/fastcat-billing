<script setup lang="ts">
const { fetchApi } = useApi()
const { user, setAuth, logout } = useAuth()
const toast = useToast()

const profile = reactive({
  name: user.value?.name || '',
  email: user.value?.email || '',
})

const loading = ref(false)
const isRevealing = ref(false)

const handleUpdate = async () => {
  loading.value = true
  try {
    await fetchApi('/user/me', {
      method: 'PATCH',
      body: profile
    })
    
    // Обновляем локальное состояние пользователя
    const updatedUser = { ...user.value, ...profile }
    setAuth(localStorage.getItem('auth_token') || '', updatedUser)
    
    toast.add({ title: 'Success', description: 'Profile updated successfully', color: 'success' })
  } catch (err: any) {
    toast.add({ title: 'Update failed', description: err.data?.error || 'Unknown error', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl space-y-10">
    <header class="flex justify-between items-start">
      <div>
        <h2 class="text-3xl font-bold">Account Settings</h2>
        <p class="text-neutral-400 mt-2">Manage your account preferences, API keys, and security.</p>
      </div>
      <UButton label="Log Out" color="error" variant="ghost" icon="i-lucide-log-out" @click="logout" />
    </header>

    <!-- Profile Section -->
    <UCard class="border-neutral-800 bg-neutral-900 shadow-xl overflow-hidden">
        <template #header>
            <h3 class="text-lg font-semibold flex items-center gap-2">
                <UIcon name="i-lucide-user" class="text-blue-500" />
                Profile Information
            </h3>
        </template>
        <form @submit.prevent="handleUpdate" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UFormField label="Full Name">
                    <UInput v-model="profile.name" class="w-full" size="lg" />
                </UFormField>
                <UFormField label="Email Address">
                    <UInput v-model="profile.email" type="email" class="w-full" size="lg" />
                </UFormField>
            </div>
            <div class="flex items-center justify-between border-t border-neutral-800 pt-6">
                <div>
                   <p class="font-medium">User Status</p>
                   <p class="text-sm text-neutral-400">Your account is fully verified.</p>
                </div>
                <UBadge label="Active" color="success" variant="soft" />
            </div>
        </form>
        <template #footer>
            <div class="flex justify-end gap-2">
                <UButton label="Discard Changes" variant="ghost" color="neutral" @click="Object.assign(profile, { name: user?.name, email: user?.email })" />
                <UButton label="Save Changes" color="primary" :loading="loading" @click="handleUpdate" />
            </div>
        </template>
    </UCard>

    <!-- API Keys Section -->
    <UCard class="border-neutral-800 bg-neutral-900 shadow-xl">
        <template #header>
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold flex items-center gap-2">
                    <UIcon name="i-lucide-key" class="text-amber-500" />
                    API Management
                </h3>
                <UButton label="Manage Keys" icon="i-lucide-plus" size="sm" color="warning" variant="soft" />
            </div>
        </template>
        <div class="space-y-4">
            <div class="p-4 rounded-xl border border-neutral-800 bg-neutral-950/50 flex items-center justify-between group">
                <div>
                    <p class="font-medium font-mono text-xs text-neutral-500 mb-2 uppercase tracking-widest">Master API Key</p>
                    <code class="text-sm text-neutral-400 bg-neutral-900 px-2 py-1 rounded select-all font-mono">
                        {{ isRevealing ? user?.api_key : 'fc_••••••••••••••••••••••••' }}
                    </code>
                </div>
                <div class="flex items-center gap-2">
                   <UButton
                     :icon="isRevealing ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                     variant="ghost"
                     color="neutral"
                     size="sm"
                     @click="isRevealing = !isRevealing"
                   />
                   <UButton icon="i-lucide-copy" variant="ghost" color="neutral" size="sm" @click="() => { navigator.clipboard.writeText(user?.api_key || '') }" />
                </div>
            </div>
        </div>
        <div class="mt-8 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-sm text-amber-200">
           <div class="flex gap-3">
              <UIcon name="i-lucide-alert-triangle" class="text-xl shrink-0" />
              <p>Keep your API keys secret. Anyone with access to your keys can use your credits. Never commit keys to version control.</p>
           </div>
        </div>
    </UCard>

    <!-- Danger Zone -->
    <section>
        <h3 class="text-lg font-semibold text-red-500 mb-4 px-1 flex items-center gap-2">
           <UIcon name="i-lucide-flame" />
           Danger Zone
        </h3>
        <UCard class="border-red-900/50 bg-red-950/20">
            <div class="flex items-center justify-between">
                <div>
                    <h4 class="font-bold text-red-400">Delete Account</h4>
                    <p class="text-sm text-red-300 opacity-60">Permanently remove all data and balance. This action is irreversible.</p>
                </div>
                <UButton label="Delete Permanently" color="error" variant="soft" />
            </div>
        </UCard>
    </section>
  </div>
</template>
