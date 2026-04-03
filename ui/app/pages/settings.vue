<script setup lang="ts">
const apiKeys = ref([
  { name: 'Production Key', key: 'fc_live_••••••••••••••••••••3a', created: 'Jan 2024' },
  { name: 'Testing Key', key: 'fc_test_••••••••••••••••••••x1', created: 'Mar 2024' }
])

const isRevealing = ref(false)

const profile = reactive({
  name: 'Ivan Ivanov',
  email: 'ivan@example.com',
  notifications: true,
  theme: 'dark'
})
</script>

<template>
  <div class="max-w-4xl space-y-10">
    <header>
      <h2 class="text-3xl font-bold">Account Settings</h2>
      <p class="text-neutral-400 mt-2">Manage your account preferences, API keys, and security.</p>
    </header>

    <!-- Profile Section -->
    <UCard class="border-neutral-800 bg-neutral-900 shadow-xl overflow-hidden">
        <template #header>
            <h3 class="text-lg font-semibold flex items-center gap-2">
                <UIcon name="i-lucide-user" class="text-blue-500" />
                Profile Information
            </h3>
        </template>
        <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UFormField label="Full Name">
                    <UInput v-model="profile.name" class="w-full" />
                </UFormField>
                <UFormField label="Email Address">
                    <UInput v-model="profile.email" type="email" class="w-full" />
                </UFormField>
            </div>
            <div class="flex items-center justify-between border-t border-neutral-800 pt-6">
                <div>
                   <p class="font-medium">Email Notifications</p>
                   <p class="text-sm text-neutral-400">Receive weekly usage summaries.</p>
                </div>
                <USwitch v-model="profile.notifications" color="primary" />
            </div>
        </div>
        <template #footer>
            <div class="flex justify-end gap-2">
                <UButton label="Discard Changes" variant="ghost" color="neutral" />
                <UButton label="Save Changes" color="primary" />
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
                <UButton label="Generate New Key" icon="i-lucide-plus" size="sm" color="warning" variant="soft" />
            </div>
        </template>
        <div class="space-y-4">
            <div v-for="ak in apiKeys" :key="ak.name" class="p-4 rounded-xl border border-neutral-800 bg-neutral-950/50 flex items-center justify-between group">
                <div>
                    <p class="font-medium">{{ ak.name }}</p>
                    <p class="text-xs text-neutral-500 mb-2">Created {{ ak.created }}</p>
                    <code class="text-sm text-neutral-400 bg-neutral-900 px-2 py-1 rounded select-all font-mono">{{ isRevealing ? ak.key.replace('••••', '7sd9') : ak.key }}</code>
                </div>
                <div class="flex items-center gap-2">
                   <UButton
                     :icon="isRevealing ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                     variant="ghost"
                     color="neutral"
                     size="sm"
                     @click="isRevealing = !isRevealing"
                   />
                   <UButton icon="i-lucide-trash" variant="ghost" color="error" size="sm" />
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
