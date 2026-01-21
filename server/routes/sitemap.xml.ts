import { SitemapStream, streamToPromise } from 'sitemap'
const { public: pub } = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    const docs = await queryCollection(event, 'content').all()

    const sitemap = new SitemapStream({
        hostname: pub.siteUrl
    })

    for (const doc of docs) {
        sitemap.write({
            url: doc.path,
            changefreq: 'monthly'
        })
    }

    sitemap.end()
    setHeader(event, 'content-type', 'application/xml')
    return streamToPromise(sitemap)
})
