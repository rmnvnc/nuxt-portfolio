export default defineEventHandler(async (event) => {
    const storage = useStorage('cache')
    const cacheKey = 'github-projects'
    const cacheTTL = 3600

    // Try to get cached data
    const cachedData = await storage.getItem(cacheKey)

    if (cachedData) {
        // Check if cached data is still valid
        const {data, timestamp} = cachedData as {data: any, timestamp: number}
        const age = (Date.now() - timestamp) / 1000 // age in seconds

        if (age < cacheTTL) {
            // Cache is still valid, return cached data
            setHeader(event, 'X-Cache', 'HIT')
            setHeader(event, 'Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
            return data
        }
        
        // Cache miss or expired - fetch from GitHub
        setHeader(event, 'X-Cache', 'MISS')
        setHeader(event, 'Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    }


    try {
        const response = await $fetch(`https://api.github.com/users/rmnvnc/repos`, {
            params: {
                sort: 'updated',
                per_page: 100,
                type: 'public'
            },
            headers: {
                'Accept': 'application/vnd.github.v3+json',
            }
        })
      
        // Transform data
        const transformedData = response.map((repo: any) => ({
            id: repo.id,
            name: repo.name,
            description: repo.description,
            html_url: repo.html_url,
            size: repo.size,
            owner: {
                avatar_url: repo.owner.avatar_url
            },
            updated_at: repo.updated_at
        }))
        
        // Store in cache with timestamp
        await storage.setItem(cacheKey, {
            data: transformedData,
            timestamp: Date.now()
        })
        
        return transformedData
    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to fetch projects'
        })
    }
  })