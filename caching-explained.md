# Caching Strategy Documentation

## Overview

This document explains the multi-layer caching strategy implemented in this Nuxt portfolio project. Understanding these layers helps optimize performance and manage cache invalidation.

---

## Your Caching Layers - Visual Guide

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER REQUEST FLOW                            │
└─────────────────────────────────────────────────────────────────┘

User Request
    │
    ▼
┌─────────────────────────────────────────────────────────────────┐
│ 1. VERCEL EDGE NETWORK (First Layer)                            │
│    Location: Global CDN (closest to user)                       │
│    Checks: HTTP Cache-Control headers                           │
└─────────────────────────────────────────────────────────────────┘
    │
    ├─ Cache HIT? ──────────────┐
    │                           │
    │ YES                       │ NO
    │                           │
    ▼                           ▼
Return Cached          ┌─────────────────────────────────────────┐
(Instant)              │ 2. ISR CACHE (Vercel Static Generation)  │
                       │    Location: Vercel's static storage    │
                       │    Checks: isr: 86400 (1 day)          │
                       └─────────────────────────────────────────┘
                                │
                                ├─ Valid? ───────────┐
                                │                    │
                                │ YES                │ NO
                                │                    │
                                ▼                    ▼
                        Return Static      ┌─────────────────────────────┐
                        (Fast)             │ 3. NITRO SERVER              │
                                           │    Render page on-demand     │
                                           └─────────────────────────────┘
                                                      │
                                                      ▼
                                           ┌─────────────────────────────┐
                                           │ 4. NITRO STORAGE CACHE      │
                                           │    (for API calls only)     │
                                           │    Location: Server memory  │
                                           └─────────────────────────────┘
                                                      │
                                                      ▼
                                           ┌─────────────────────────────┐
                                           │ 5. CLIENT PAYLOAD CACHE     │
                                           │    (for client navigation)   │
                                           │    Location: Browser memory │
                                           └─────────────────────────────┘
```

---

## Your Specific Pages - What Caching They Get

### Blog Pages (`/blog/**`)

**Configuration:**
- `isr: 86400` (1 day revalidation)
- `prerender: true`

**Caching Status:**
- ✅ **EDGE CACHING:** YES (automatic with ISR)
  - Vercel automatically caches ISR pages at edge
  - Cache duration: 1 day (86400 seconds)
  - Revalidates in background after expiry

- ✅ **PRERENDER:** YES
  - Pages are pre-built at build time
  - Served as static HTML initially

- ✅ **CLIENT PAYLOAD CACHE:** YES
  - `getCachedData` in `blog/[...slug].vue`
  - Session-based (until page refresh)

---

### Homepage (`/`)

**Configuration:**
- `isr: 3600` (1 hour revalidation)
- `prerender: true`

**Caching Status:**
- ✅ **EDGE CACHING:** YES (automatic with ISR)
  - Cache duration: 1 hour (3600 seconds)

- ✅ **PRERENDER:** YES

- ✅ **CLIENT PAYLOAD CACHE:** YES
  - `getCachedData` in `index.vue`

---

### Static Pages (`/about`, `/projects`)

**Configuration:**
- `prerender: true`
- `headers: { 'Cache-Control': 's-maxage=86400' }`

**Caching Status:**
- ✅ **EDGE CACHING:** YES (via explicit headers)
  - Cache-Control: s-maxage=86400 (1 day)
  - Explicit HTTP header set in routeRules

- ✅ **PRERENDER:** YES
  - Fully static, never changes

- ⚠️ **CLIENT PAYLOAD CACHE:** NO
  - `projects.vue` doesn't have `getCachedData`
  - Could add if needed

---

### API Endpoint (`/api/projects`)

**Configuration:**
- Cache-Control headers set in handler
- Nitro storage cache enabled

**Caching Status:**
- ✅ **EDGE CACHING:** YES (via HTTP headers)
  - Cache-Control: `s-maxage=3600, stale-while-revalidate=86400`
  - Set directly in `server/api/projects.ts`

- ✅ **NITRO STORAGE CACHE:** YES
  - `useStorage('cache')` with memory driver
  - 1 hour TTL, server-side

- ✅ **CLIENT PAYLOAD CACHE:** YES
  - `getCachedData` in `ProjectList.vue`

---

## Edge Caching vs Prerender

| Feature | Prerender | Edge Caching |
|---------|-----------|--------------|
| **What it is** | Pre-build pages at build time | Cache responses at CDN edge |
| **When it happens** | During `npm run build` | During runtime (on-demand) |
| **Location** | Static files on disk | CDN edge servers globally |
| **Speed** | Fast (static files) | Very fast (closest edge) |
| **Updates** | Requires rebuild | Can revalidate without rebuild |
| **Your blog** | ✅ Prerendered + ✅ Edge cached | ✅ Both! |

---

## Answer: Do Blog Pages Get Edge Caching?

**YES!** Your blog pages get edge caching because:

1. **ISR enables edge caching automatically** on Vercel
2. `isr: 86400` tells Vercel to cache at the edge for 1 day
3. After expiry, Vercel revalidates in the background

---

## Visual: Request Flow for `/blog/first`

```
User in Tokyo requests /blog/first
    │
    ▼
┌─────────────────────────────────────┐
│ Vercel Edge (Tokyo)                 │
│ Check: Is page cached?               │
└─────────────────────────────────────┘
    │
    ├─ Cached? YES ────────────────┐
    │                              │
    │ Return cached HTML (0ms)     │
    │                              │
    │ NO                           │
    ▼                              │
┌─────────────────────────────────────┐
│ Vercel Origin (US)                  │
│ Check: Is ISR cache valid?          │
└─────────────────────────────────────┘
    │
    ├─ Valid? YES ────────────────┐
    │                              │
    │ Return static HTML (fast)    │
    │                              │
    │ NO                           │
    ▼                              │
┌─────────────────────────────────────┐
│ Nitro Server                        │
│ Render page on-demand               │
│ - Check payload cache              │
│ - Fetch from content collection    │
└─────────────────────────────────────┘
    │
    ▼
Return rendered HTML
(Store in ISR cache for next time)
```

---

## Summary Table

| Page/Route | Prerender | ISR | Edge Cache | HTTP Headers | Payload Cache |
|------------|-----------|-----|------------|--------------|---------------|
| `/` | ✅ | ✅ (1h) | ✅ Auto | ❌ | ✅ |
| `/blog/**` | ✅ | ✅ (1d) | ✅ Auto | ❌ | ✅ |
| `/about` | ✅ | ❌ | ✅ Manual | ✅ | ❌ |
| `/projects` | ✅ | ❌ | ✅ Manual | ✅ | ❌ |
| `/api/projects` | ❌ | ❌ | ✅ Manual | ✅ | ✅ |

---

## Key Takeaways

- ✅ **Blog pages get edge caching automatically** via ISR
- ✅ **Prerender** = build-time static files
- ✅ **Edge cache** = runtime CDN caching
- ✅ They work together: prerender for initial build, edge cache for runtime performance

Your blog pages are cached at the edge for 1 day, then revalidated automatically!

---

## Configuration Files

### `nuxt.config.ts` - Route Rules

```typescript
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
}
```

### `nuxt.config.ts` - Nitro Storage

```typescript
nitro: {
  storage: {
    cache: {
      driver: 'memory', // or 'redis' for production
    }
  }
}
```

### `server/api/projects.ts` - HTTP Headers

```typescript
setHeader(event, 'Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
```

### Component/Page - Payload Cache

```typescript
const { data } = await useAsyncData(
  'key',
  () => fetchData(),
  {
    getCachedData: (key) => {
      return useNuxtApp().payload.data[key]
    },
    server: true,
    default: () => null,
  }
)
```

---

## Cache Hierarchy (Priority Order)

1. **Nuxt Payload Cache** (fastest, session-based)
   - Location: Browser memory
   - Duration: Until page refresh
   - Used by: `getCachedData` in components/pages

2. **Nitro Storage Cache** (if used)
   - Location: Server memory/Redis
   - Duration: Until server restart (memory) or TTL (Redis)
   - Used by: `useStorage()` calls

3. **Vercel Edge Cache** (HTTP level)
   - Location: Vercel Edge Network
   - Duration: Based on `Cache-Control` headers
   - Used by: All HTTP responses

4. **ISR Cache** (page-level)
   - Location: Vercel's static generation
   - Duration: Based on `isr` value
   - Used by: Pre-rendered pages

---

## How to Add Caching for Different Types

### Adding Edge Caching to a Page

**Option 1: ISR (Recommended for dynamic content)**
```typescript
// nuxt.config.ts
routeRules: {
  '/your-page': {
    isr: 3600, // Cache for 1 hour
    prerender: true
  }
}
```

**Option 2: HTTP Headers (For static pages)**
```typescript
// nuxt.config.ts
routeRules: {
  '/your-page': {
    prerender: true,
    headers: { 'Cache-Control': 's-maxage=86400' }
  }
}
```

### Adding API Caching

```typescript
// server/api/your-endpoint.ts
export default defineEventHandler(async (event) => {
  // Set cache headers
  setHeader(event, 'Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  
  // Your API logic here
  return data
})
```

### Adding Nitro Storage Cache

```typescript
// server/api/your-endpoint.ts
export default defineEventHandler(async (event) => {
  const storage = useStorage('cache')
  const cacheKey = 'your-cache-key'
  const cacheTTL = 3600 // 1 hour
  
  // Check cache
  const cached = await storage.getItem(cacheKey)
  if (cached) {
    const { data, timestamp } = cached as { data: any, timestamp: number }
    const age = (Date.now() - timestamp) / 1000
    
    if (age < cacheTTL) {
      return data
    }
  }
  
  // Fetch fresh data
  const data = await fetchData()
  
  // Store in cache
  await storage.setItem(cacheKey, {
    data,
    timestamp: Date.now()
  })
  
  return data
})
```

### Adding Client Payload Cache

```typescript
// app/pages/your-page.vue or app/components/YourComponent.vue
const { data } = await useAsyncData(
  'unique-key',
  () => fetchData(),
  {
    getCachedData: (key) => {
      return useNuxtApp().payload.data[key]
    },
    server: true,
    default: () => null,
  }
)
```

---

*Last updated: Based on current project configuration*
