<script setup lang="ts">
const { fetchApi } = useApi()
const { user } = useAuth()

const { data: transactions } = await useAsyncData('transactions', () => fetchApi('/user/transactions'), {
  lazy: true,
  server: false
})

const paymentMethods = [
  { id: 'pm-1', type: 'visa', last4: '4242', expiry: '06/28', default: true },
  { id: 'pm-2', type: 'mastercard', last4: '8811', expiry: '11/26', default: false }
]
</script>

<template>
  <div class="space-y-10">
    <!-- Header Section -->
    <header class="flex items-center justify-between">
      <h2 class="text-3xl font-bold">Billing & Payments</h2>
      <UButton label="Download Statement" icon="i-lucide-download" variant="outline" color="neutral" />
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Payment Methods and Invoices -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Payment Methods Card -->
        <section class="space-y-4">
          <h3 class="text-xl font-semibold">Payment Methods</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UCard v-for="pm in paymentMethods" :key="pm.id" class="border-neutral-800 bg-neutral-900/50">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center">
                  <UIcon :name="pm.type === 'visa' ? 'i-simple-icons-visa' : 'i-simple-icons-mastercard'" class="text-2xl text-neutral-400" />
                </div>
                <div class="flex-1">
                  <p class="font-bold font-mono text-lg">•••• •••• •••• {{ pm.last4 }}</p>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-neutral-400">Expires {{ pm.expiry }}</span>
                    <UBadge v-if="pm.default" label="Default" variant="soft" size="sm" color="primary" />
                  </div>
                </div>
                <UDropdownMenu :items="[[{ label: 'Edit' }, { label: 'Remove', color: 'error' }]]">
                  <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" />
                </UDropdownMenu>
              </div>
            </UCard>
            <button class="border-2 border-dashed border-neutral-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:border-neutral-600 transition-colors group">
              <UIcon name="i-lucide-plus" class="text-2xl text-neutral-600 group-hover:text-neutral-400" />
              <span class="text-sm font-medium text-neutral-400">Add Payment Method</span>
            </button>
          </div>
        </section>

        <!-- Transactions History Card -->
        <section class="space-y-4">
          <h3 class="text-xl font-semibold">Transaction History</h3>
          <div class="border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900/50 backdrop-blur-sm">
            <table class="w-full text-left">
              <thead>
                 <tr class="border-b border-neutral-800">
                    <th class="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Transaction ID</th>
                    <th class="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Description</th>
                    <th class="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Amount</th>
                    <th class="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Date</th>
                    <th class="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Status</th>
                 </tr>
              </thead>
              <tbody class="divide-y divide-neutral-800/50">
                 <tr v-for="tx in transactions" :key="tx.id" class="hover:bg-neutral-800/30 transition-colors">
                    <td class="px-6 py-4 text-xs font-mono text-neutral-400">{{ tx.id.substring(0, 8) }}...</td>
                    <td class="px-6 py-4 font-medium">{{ tx.description }}</td>
                    <td class="px-6 py-4 font-mono" :class="tx.amount < 0 ? 'text-red-400' : 'text-emerald-400'">
                      {{ tx.amount > 0 ? '+' : '' }}${{ Math.abs(tx.amount).toFixed(2) }}
                    </td>
                    <td class="px-6 py-4 text-sm text-neutral-400">
                      {{ new Date(tx.created_at).toLocaleDateString() }}
                    </td>
                    <td class="px-6 py-4">
                       <UBadge color="success" variant="soft" size="sm">Completed</UBadge>
                    </td>
                 </tr>
                 <tr v-if="!transactions || transactions.length === 0">
                    <td colspan="5" class="px-6 py-12 text-center text-neutral-500">No transactions recorded yet.</td>
                 </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <!-- Right Column: Balance and Billing Info -->
      <div class="space-y-8">
        <!-- Balance Card -->
        <UCard class="border-indigo-500/20 bg-indigo-600/5 relative overflow-hidden">
          <div class="absolute -right-12 -top-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
          <h3 class="text-lg font-medium text-indigo-300 mb-1">Available Credits</h3>
          <div class="text-4xl font-bold mb-6">${{ user?.balance?.toFixed(2) || '0.00' }}</div>
          <div class="space-y-4">
             <UButton label="Add Funds" color="primary" block size="lg" />
             <UButton label="Redeem Code" variant="ghost" color="neutral" block size="sm" />
          </div>
          <p class="text-xs text-neutral-500 mt-6 text-center italic">
             Credits are automatically deducted based on usage. See <NuxtLink to="/usage" class="text-indigo-400 underline">Usage</NuxtLink> for details.
          </p>
        </UCard>

        <!-- Billing Info -->
        <UCard class="border-neutral-800 bg-neutral-900/30">
          <h4 class="font-semibold mb-4">Account Information</h4>
          <div class="space-y-2 text-sm text-neutral-400">
             <p class="text-white font-medium">{{ user?.name }}</p>
             <p>{{ user?.email }}</p>
             <p class="text-xs mt-4 opacity-50">Member since {{ new Date(user?.created_at).toLocaleDateString() }}</p>
          </div>
          <template #footer>
             <UButton label="Edit Settings" variant="ghost" color="neutral" block size="sm" to="/settings" />
          </template>
        </UCard>
      </div>
    </div>
  </div>
</template>
