// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    head: {
      title: 'Find the right research | Qesearch',
      link: [
        { rel: 'icon', href: '/favicon.ico'}
      ]
    },
  },
})
