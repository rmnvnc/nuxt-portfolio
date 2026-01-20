import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'app/',
  site: { 
    url: 'http://localhost:3000', 
    name: 'My portfolio' 
  }, 
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
  nitro: {
    prerender: {
      routes: ['/sitemap.xml']
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
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  modules: ['@nuxtjs/color-mode', '@nuxt/content', 'nuxt-og-image'],
})