<script setup lang="ts">
const paymentMethods = [
  { id: 'pm-1', type: 'visa', last4: '4242', expiry: '06/28', default: true },
  { id: 'pm-2', type: 'mastercard', last4: '8811', expiry: '11/26', default: false }
]

const recentInvoices = [
  { id: 'INV-2024-001', amount: '$420.50', date: 'March 2024', status: 'paid' },
  { id: 'INV-2024-002', amount: '$150.00', date: 'February 2024', status: 'paid' },
  { id: 'INV-2023-142', amount: '$85.20', date: 'January 2024', status: 'paid' }
]
</script>

<template>
  <div class="space-y-10">
    <!-- Header Section -->
    <header class="flex items-center justify-between">
      <h2 class="text-3xl font-bold">Billing & Payments</h2>
      <UButton label="Download All Invoices" icon="i-lucide-download" variant="outline" color="neutral" />
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

        <!-- Invoices Card -->
        <section class="space-y-4">
          <h3 class="text-xl font-semibold">Invoices History</h3>
          <div class="border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900/50 backdrop-blur-sm">
            <table class="w-full text-left">
              <thead>
                 <tr class="border-b border-neutral-800">
                    <th class="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Invoice</th>
                    <th class="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Period</th>
                    <th class="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Amount</th>
                    <th class="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Status</th>
                    <th class="px-6 py-4"></th>
                 </tr>
              </thead>
              <tbody class="divide-y divide-neutral-800/50">
                 <tr v-for="inv in recentInvoices" :key="inv.id" class="hover:bg-neutral-800/30 transition-colors">
                    <td class="px-6 py-4 font-medium">{{ inv.id }}</td>
                    <td class="px-6 py-4 text-sm text-neutral-400">{{ inv.date }}</td>
                    <td class="px-6 py-4 font-mono">{{ inv.amount }}</td>
                    <td class="px-6 py-4">
                       <UBadge color="success" variant="soft" size="sm">{{ inv.status }}</UBadge>
                    </td>
                    <td class="px-6 py-4 text-right">
                       <UButton icon="i-lucide-download" variant="ghost" color="neutral" size="sm" />
                    </td>
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
          <div class="text-4xl font-bold mb-6">$124.50</div>
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
          <h4 class="font-semibold mb-4">Billing Contact</h4>
          <div class="space-y-2 text-sm text-neutral-400">
             <p>Ivan Ivanov</p>
             <p>Tech Inc.</p>
             <p>123 Startup St, Building B</p>
             <p>Silicon Valley, CA 94000</p>
          </div>
          <template #footer>
             <UButton label="Update Details" variant="ghost" color="neutral" block size="sm" />
          </template>
        </UCard>
      </div>
    </div>
  </div>
</template>
