import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'github-light',
        }
      }
    }
  },
  colorMode: {
    classSuffix: '',
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: ['@nuxtjs/color-mode', '@nuxt/content'],
})