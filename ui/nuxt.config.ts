// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2025-07-15',

  modules: [
    '@nuxt/ui',
    '@nuxt/fonts'
  ],

  css: ['~/assets/css/main.css'],

  nitro: {
    preset: 'cloudflare-pages'
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8787'
    }
  },

  devtools: { enabled: true }
})
