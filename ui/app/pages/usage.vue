<script setup lang="ts">
const { fetchApi } = useApi()

const serviceStats = [
  { name: 'STT (Whisper Large)', usage: '42.5 hrs', cost: '$16.20', trend: '+5%', color: 'primary' as const },
  { name: 'LLM (Claude 3.5 Sonnet)', usage: '1.2M tokens', cost: '$8.40', trend: '-2%', color: 'neutral' as const },
  { name: 'Image Gen (DALL-E 3)', usage: '50 imgs', cost: '$10.00', trend: '+12%', color: 'warning' as const },
  { name: 'Video Gen (Sora Alpha)', usage: '5 mins', cost: '$25.00', trend: 'new', color: 'success' as const }
]

const { data: usageData } = await useAsyncData('usage', () => fetchApi('/usage'), {
  lazy: true,
  server: false,
  default: () => []
})
</script>

<template>
  <div class="space-y-10">
    <header class="flex items-center justify-between">
      <h2 class="text-3xl font-bold">Usage Metrics</h2>
      <div class="flex items-center gap-4">
        <USelect
          :items="['Last 7 Days', 'Last 30 Days', 'Current Month', 'Last Month']"
          placeholder="Date Range"
          class="w-48"
        />
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
            <h3 class="text-2xl font-bold">{{ service.usage }}</h3>
          </div>
          <div :class="`p-3 rounded-xl bg-${service.color}-500/10 group-hover:scale-110 transition-transform`">
             <UIcon name="i-lucide-activity" :class="`text-${service.color}-500 text-xl`" />
          </div>
        </div>
        <div class="flex items-center justify-between pt-4 border-t border-neutral-800/50">
           <span class="text-sm font-mono text-neutral-500">{{ service.cost }} total cost</span>
           <UBadge :color="service.trend.startsWith('+') ? 'success' : 'neutral'" variant="soft" size="xs">
              {{ service.trend }}
           </UBadge>
        </div>
      </UCard>
    </div>

    <!-- Charts Placeholder -->
    <section class="h-96 border border-neutral-800 rounded-3xl bg-neutral-900/50 relative flex items-center justify-center group overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-blue-500/5),_transparent)] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
        <div class="z-10 text-center space-y-4">
           <div class="flex items-center justify-center gap-3 mb-6">
              <div v-for="h in [12, 18, 14, 22, 16, 26, 20, 24, 14, 18]" :key="h"
                   class="w-4 bg-blue-500/30 rounded-t-lg transition-all hover:bg-blue-500 hover:scale-y-110"
                   :style="{ height: `${h*4}px` }" />
           </div>
           <p class="text-neutral-400">Interactive usage charts will be rendered here.</p>
           <UButton label="Configure Dashboards" variant="soft" color="neutral" size="sm" />
        </div>
    </section>

    <!-- Detailed Breakdown Table -->
    <div class="space-y-4">
       <h3 class="text-xl font-semibold">Service Details</h3>
       <div class="border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900/50 backdrop-blur-sm">
          <table class="w-full text-left">
             <thead>
                <tr class="border-b border-neutral-800">
                   <th class="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Resource Type</th>
                   <th class="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Pricing Plan</th>
                   <th class="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Unit Cost</th>
                   <th class="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Total Qty</th>
                   <th class="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Subtotal</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-neutral-800/50">
                <tr v-for="i in 5" :key="i" class="hover:bg-neutral-800/30 transition-colors">
                   <td class="px-6 py-4 font-medium">Video Rendering Engine v{{ i }}</td>
                   <td class="px-6 py-4 text-sm text-neutral-400">Reserved Tier 1</td>
                   <td class="px-6 py-4 font-mono">$0.005/frame</td>
                   <td class="px-6 py-4">12,400 frames</td>
                   <td class="px-6 py-4 font-mono font-bold">$62.00</td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>
  </div>
</template>
