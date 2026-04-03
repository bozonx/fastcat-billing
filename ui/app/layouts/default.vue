<script setup lang="ts">
const items = [
  {
    label: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
    to: '/'
  },
  {
    label: 'Usage',
    icon: 'i-lucide-chart-bar',
    to: '/usage'
  },
  {
    label: 'Billing',
    icon: 'i-lucide-credit-card',
    to: '/billing'
  },
  {
    label: 'Settings',
    icon: 'i-lucide-settings',
    to: '/settings'
  }
]
</script>

<template>
  <div class="min-h-screen bg-neutral-950 text-neutral-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 border-r border-neutral-800 flex flex-col p-4 gap-6 sticky top-0 h-screen">
      <div class="flex items-center gap-2 px-2 py-4">
        <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <UIcon name="i-lucide-zap" class="text-white text-xl" />
        </div>
        <span class="font-bold text-xl tracking-tight">FastCat Billing</span>
      </div>

      <nav class="flex-1">
        <UNavigationMenu
          :items="items"
          orientation="vertical"
          variant="pill"
          class="gap-1"
        />
      </nav>

      <div class="border-t border-neutral-800 pt-4 px-2">
        <div class="flex items-center gap-3">
          <UAvatar src="https://github.com/nutlope.png" alt="User" size="sm" />
          <div class="flex-1 overflow-hidden">
            <p class="text-sm font-medium truncate">Ivan Ivanov</p>
            <p class="text-xs text-neutral-400 truncate">ivan@example.com</p>
          </div>
          <UButton
            icon="i-lucide-log-out"
            color="neutral"
            variant="ghost"
            size="sm"
          />
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col">
      <header class="h-16 border-b border-neutral-800 flex items-center px-8 justify-between sticky top-0 bg-neutral-950/80 backdrop-blur-md z-10">
        <h1 class="text-lg font-semibold capitalize">{{ $route.name === 'index' ? 'Dashboard' : $route.name }}</h1>
        <div class="flex items-center gap-4">
          <UButton
            icon="i-lucide-bell"
            color="neutral"
            variant="ghost"
          />
          <UColorModeButton />
        </div>
      </header>

      <div class="p-8">
        <slot />
      </div>
    </main>
  </div>
</template>
