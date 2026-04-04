<script setup lang="ts">
const { fetchApi } = useApi()
const { user } = useAuth()

// Fetch real dashboard stats
const { data: dashboardData, refresh } = await useAsyncData('dashboard', () => fetchApi('/stats/dashboard'), {
  lazy: true,
  server: false
})

const stats = computed(() => [
  { label: 'Current Balance', value: `$${dashboardData.value?.balance?.toFixed(2) || '0.00'}`, icon: 'i-lucide-wallet', color: 'primary' as const },
  { label: 'Token Usage', value: `${(dashboardData.value?.llm_tokens / 1000).toFixed(1) || '0'}k`, icon: 'i-lucide-zap', color: 'warning' as const },
  { label: 'Active Services', value: `${dashboardData.value?.active_services_count || 0}`, icon: 'i-lucide-cpu', color: 'success' as const },
  { label: 'Status', value: 'Active', icon: 'i-lucide-check-circle', color: 'neutral' as const }
])

const transactions = computed(() => dashboardData.value?.recent_transactions?.map((tx: any) => ({
  id: tx.id,
  service: tx.description,
  amount: `${tx.amount > 0 ? '+' : ''}$${Math.abs(tx.amount).toFixed(2)}`,
  date: new Date(tx.created_at).toLocaleDateString(),
  status: 'completed',
  isNegative: tx.amount < 0
})) || [])
</script>

<template>
  <div class="space-y-10">
    <!-- Header Hero Section with Gradient -->
    <section class="relative p-8 rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900/50">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 pointer-events-none" />
      <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2 class="text-3xl font-bold mb-2">Welcome back, {{ user?.name || 'User' }}!</h2>
          <p class="text-neutral-400">ваша учетная запись активна. Ваш API ключ: <code class="bg-neutral-800 px-2 py-1 rounded text-indigo-400">{{ user?.api_key }}</code></p>
        </div>
        <UButton
          size="xl"
          label="Top Up Balance"
          icon="i-lucide-plus-circle"
          color="primary"
          class="rounded-full px-8 shadow-lg shadow-blue-500/20"
          @click="refresh"
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
          <span>Real-time updates</span>
        </div>
      </UCard>
    </div>

    <!-- Main Content Split -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Transactions -->
      <div class="lg:col-span-2 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold">Recent Transactions</h3>
          <UButton label="View All" variant="ghost" color="neutral" size="sm" to="/billing" />
        </div>
        <div class="border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900/50 backdrop-blur-sm">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-neutral-800">
                <th class="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Service / Description</th>
                <th class="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Date</th>
                <th class="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Amount</th>
                <th class="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-800/50">
              <tr v-for="tx in transactions" :key="tx.id" class="hover:bg-neutral-800/30 transition-colors">
                <td class="px-6 py-4 font-medium">{{ tx.service }}</td>
                <td class="px-6 py-4 text-sm text-neutral-400">{{ tx.date }}</td>
                <td class="px-6 py-4 font-mono" :class="tx.isNegative ? 'text-neutral-50' : 'text-emerald-400'">
                  {{ tx.amount }}
                </td>
                <td class="px-6 py-4">
                  <UBadge color="success" variant="soft" size="sm">
                    {{ tx.status }}
                  </UBadge>
                </td>
              </tr>
              <tr v-if="transactions.length === 0">
                <td colspan="4" class="px-6 py-12 text-center text-neutral-500">No transactions yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick Actions / Mini Stats -->
      <div class="space-y-8">
        <!-- AI API Info -->
        <div class="space-y-4">
          <h3 class="text-xl font-semibold">Developer API</h3>
          <UCard class="border-neutral-800 bg-neutral-900/50">
            <div class="space-y-4">
              <p class="text-xs text-neutral-400 uppercase tracking-widest font-bold">Base URL</p>
              <code class="block bg-neutral-950 p-3 rounded-lg text-sm text-indigo-400 break-all select-all">
                http://localhost:8787/api/v1/ai
              </code>
              
              <p class="text-xs text-neutral-400 uppercase tracking-widest font-bold mt-4">Authorization</p>
              <p class="text-sm text-neutral-300">Use your API Key in <code class="text-indigo-400">X-API-Key</code> header.</p>
            </div>
            <template #footer>
              <UButton label="Read Documentation" block variant="outline" color="neutral" />
            </template>
          </UCard>
        </div>

        <!-- Notification Card -->
        <div class="p-6 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 relative overflow-hidden group">
          <div class="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
          <h4 class="font-bold text-lg mb-1">MVP Version</h4>
          <p class="text-sm text-indigo-300 mb-4">You are using the stable v1 API with a 10% markup on external providers.</p>
          <UButton label="Learn More" color="primary" size="sm" variant="soft" />
        </div>
      </div>
    </div>
  </div>
</template>
