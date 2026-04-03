<script setup lang="ts">
// Nuxt UI 4 uses the same <UApp> wrapper for components like Toast, Modal etc.
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<style>
/* Nuxt UI 4 might use CSS variables for colors, we can customize them here if needed */
:root {
  --ui-primary: var(--color-blue-500);
}
</style>
