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
    },
    // Storage for caching
    storage: {
      cache: {
        driver: 'upstash',
        base: 'cache',
        ttl: 60
      }
    },
    devStorage: {
      cache: {
        driver: 'memory'
      }
    }
  },
  // Add route rules for ISR-like behavior
  routeRules: {
    // Homepage - ISR with 1 hour revalidation
    '/': { 
      isr: 3600, // Revalidate every hour
      prerender: true 
    },
    // Blog posts - ISR with 1 day revalidation
    '/blog/**': { 
      isr: 86400, // Revalidate every day
      prerender: true 
    },
    // Static pages - fully static
    '/about': { 
      prerender: true,
      headers: { 'Cache-Control': 's-maxage=86400' }
    },
    '/projects': { 
      prerender: true,
      headers: { 'Cache-Control': 's-maxage=86400' }
    },
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