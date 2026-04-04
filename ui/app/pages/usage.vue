<script setup lang="ts">
const { fetchApi } = useApi()

const { data: usageLogs } = await useAsyncData('usage', () => fetchApi('/user/usage'), {
  lazy: true,
  server: false,
  default: () => []
})

const serviceStats = computed(() => {
  const stats: any[] = []
  const groups = usageLogs.value.reduce((acc: any, log: any) => {
    if (!acc[log.service_name]) acc[log.service_name] = { usage: 0, cost: 0 }
    acc[log.service_name].usage += log.amount
    acc[log.service_name].cost += log.cost
    return acc
  }, {})

  Object.entries(groups).forEach(([name, data]: [string, any]) => {
    stats.push({
      name,
      usage: data.usage.toFixed(2),
      cost: `$${data.cost.toFixed(2)}`,
      trend: 'Real-time',
      color: name.includes('LLM') ? 'primary' : name.includes('STT') ? 'warning' : 'success'
    })
  })

  return stats
})
</script>

<template>
  <div class="space-y-10">
    <header class="flex items-center justify-between">
      <h2 class="text-3xl font-bold">Usage Metrics</h2>
      <div class="flex items-center gap-4">
        <UButton label="Export CSV" icon="i-lucide-file-text" variant="outline" color="neutral" />
      </div>
    </header>

    <!-- Usage Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <UCard
        v-for="service in serviceStats"
        :key="service.name"
        class="border-neutral-800 bg-neutral-900 group hover:border-neutral-700 transition-colors"
      >
        <div class="flex items-start justify-between mb-4">
          <div>
            <p class="text-sm text-neutral-400 font-medium">{{ service.name }}</p>
            <h3 class="text-2xl font-bold">{{ service.usage }} units</h3>
          </div>
          <div :class="`p-3 rounded-xl bg-${service.color}-500/10 group-hover:scale-110 transition-transform`">
             <UIcon name="i-lucide-activity" :class="`text-${service.color}-500 text-xl`" />
          </div>
        </div>
        <div class="flex items-center justify-between pt-4 border-t border-neutral-800/50">
           <span class="text-sm font-mono text-neutral-500">{{ service.cost }} total cost</span>
           <UBadge color="neutral" variant="soft" size="xs">
              {{ service.trend }}
           </UBadge>
        </div>
      </UCard>
      
      <UCard v-if="serviceStats.length === 0" class="border-neutral-800 bg-neutral-900/50 col-span-full py-12 text-center text-neutral-500">
          No usage data recorded for the current period.
      </UCard>
    </div>

    <!-- Latest Activity Table -->
    <div class="space-y-4">
       <h3 class="text-xl font-semibold">Latest Activity (Last 50 requests)</h3>
       <div class="border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900/50 backdrop-blur-sm">
          <table class="w-full text-left">
             <thead>
                <tr class="border-b border-neutral-800">
                   <th class="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Service</th>
                   <th class="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Amount</th>
                   <th class="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Cost (inc. 10% fee)</th>
                   <th class="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Timestamp</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-neutral-800/50">
                <tr v-for="log in usageLogs" :key="log.id" class="hover:bg-neutral-800/30 transition-colors">
                   <td class="px-6 py-4 font-medium">{{ log.service_name }}</td>
                   <td class="px-6 py-4 text-sm text-neutral-400 font-mono">{{ log.amount.toFixed(2) }}</td>
                   <td class="px-6 py-4 font-mono font-bold text-red-400">${{ log.cost.toFixed(4) }}</td>
                   <td class="px-6 py-4 text-sm text-neutral-500 font-mono italic">
                      {{ new Date(log.created_at).toLocaleString() }}
                   </td>
                </tr>
                <tr v-if="usageLogs.length === 0">
                    <td colspan="4" class="px-6 py-12 text-center text-neutral-500">No activity logs found.</td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>
  </div>
</template>
