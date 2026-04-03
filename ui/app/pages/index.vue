<script setup lang="ts">
const { fetchApi } = useApi()

// Mock data for initial state
const stats = ref([
  { label: 'Current Balance', value: '$124.50', icon: 'i-lucide-wallet', color: 'primary' as const },
  { label: 'Token Usage', value: '45.2k', icon: 'i-lucide-zap', color: 'warning' as const },
  { label: 'Active Services', value: '3/5', icon: 'i-lucide-cpu', color: 'success' as const },
  { label: 'Next Refill', value: '12 Apr', icon: 'i-lucide-calendar', color: 'neutral' as const }
])

interface Transaction {
  id: string
  service: string
  amount: string
  date: string
  status: 'completed' | 'pending' | 'failed'
}

const transactions: Transaction[] = [
  { id: 'tx-1', service: 'STT (Whisper)', amount: '-$0.40', date: 'Just now', status: 'completed' },
  { id: 'tx-2', service: 'LLM (Claude 3.5)', amount: '-$1.20', date: '2 hours ago', status: 'completed' },
  { id: 'tx-3', service: 'Balance Top-up', amount: '+$50.00', date: 'Yesterday', status: 'completed' },
  { id: 'tx-4', service: 'Image Gen (DALL-E)', amount: '-$2.00', date: '2 days ago', status: 'completed' }
]

const { data: balanceData } = await useAsyncData('balance', () => fetchApi('/balance'), {
  lazy: true,
  server: false
})
</script>

<template>
  <div class="space-y-10">
    <!-- Header Hero Section with Gradient -->
    <section class="relative p-8 rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900/50">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 pointer-events-none" />
      <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2 class="text-3xl font-bold mb-2">Welcome back, Ivan!</h2>
          <p class="text-neutral-400">Your billing account is in good standing. Keep creating amazing videos.</p>
        </div>
        <UButton
          size="xl"
          label="Top Up Balance"
          icon="i-lucide-plus-circle"
          color="primary"
          class="rounded-full px-8 shadow-lg shadow-blue-500/20"
        />
      </div>
    </section>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <UCard
        v-for="stat in stats"
        :key="stat.label"
        class="border-neutral-800 bg-neutral-900 hover:border-neutral-700 transition-colors group"
      >
        <template #header>
          <div class="flex items-center justify-between pb-2">
            <span class="text-sm font-medium text-neutral-400">{{ stat.label }}</span>
            <div :class="`p-2 rounded-lg bg-${stat.color}-500/10 group-hover:scale-110 transition-transform`">
              <UIcon :name="stat.icon" :class="`text-${stat.color}-500 text-lg`" />
            </div>
          </div>
        </template>
        <div class="text-2xl font-bold tracking-tight">{{ stat.value }}</div>
        <div class="text-xs text-neutral-500 mt-2 flex items-center gap-1">
          <UIcon name="i-lucide-trending-up" class="text-emerald-500" />
          <span>+12.5% from last month</span>
        </div>
      </UCard>
    </div>

    <!-- Main Content Split -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Transactions -->
      <div class="lg:col-span-2 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold">Recent Transactions</h3>
          <UButton label="View All" variant="ghost" color="neutral" size="sm" />
        </div>
        <div class="border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900/50 backdrop-blur-sm">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-neutral-800">
                <th class="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Service</th>
                <th class="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Date</th>
                <th class="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Amount</th>
                <th class="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-800/50">
              <tr v-for="tx in transactions" :key="tx.id" class="hover:bg-neutral-800/30 transition-colors">
                <td class="px-6 py-4 font-medium">{{ tx.service }}</td>
                <td class="px-6 py-4 text-sm text-neutral-400">{{ tx.date }}</td>
                <td class="px-6 py-4 font-mono" :class="tx.amount.startsWith('-') ? 'text-neutral-50' : 'text-emerald-400'">
                  {{ tx.amount }}
                </td>
                <td class="px-6 py-4">
                  <UBadge :color="tx.status === 'completed' ? 'success' : 'warning'" variant="soft" size="sm">
                    {{ tx.status }}
                  </UBadge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick Actions / Mini Stats -->
      <div class="space-y-8">
        <!-- Usage Breakdown -->
        <div class="space-y-4">
          <h3 class="text-xl font-semibold">Usage Limits</h3>
          <UCard class="border-neutral-800 bg-neutral-900/50">
            <div class="space-y-6">
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-neutral-400">Speech to Text</span>
                  <span class="font-medium">85/100 hrs</span>
                </div>
                <UProgress :value="85" color="primary" />
              </div>
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-neutral-400">LLM Tokens</span>
                  <span class="font-medium">2.4M/10M</span>
                </div>
                <UProgress :value="24" color="neutral" />
              </div>
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-neutral-400">Image Generation</span>
                  <span class="font-medium">12/50 imgs</span>
                </div>
                <UProgress :value="24" color="warning" />
              </div>
            </div>
            <template #footer>
              <UButton label="Adjust Limits" block variant="outline" color="neutral" />
            </template>
          </UCard>
        </div>

        <!-- Notification Card -->
        <div class="p-6 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 relative overflow-hidden group">
          <div class="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
          <h4 class="font-bold text-lg mb-1">Early Adopter Bonus!</h4>
          <p class="text-sm text-indigo-300 mb-4">You have 10% discount on all LLM services until June.</p>
          <UButton label="Learn More" color="primary" size="sm" variant="soft" />
        </div>
      </div>
    </div>
  </div>
</template>
