import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'app/',
  site: { 
    url: 'https://nuxt-portfolio-beryl-nu.vercel.app/', 
    name: 'My portfolio' 
  }, 
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  content: {
    experimental: { sqliteConnector: 'native' },
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
   runtimeConfig: {
    public: {
      siteUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
    }
  },
  modules: ['@nuxtjs/color-mode', '@nuxt/content', 'nuxt-og-image'],
})