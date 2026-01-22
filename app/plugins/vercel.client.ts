import { injectSpeedInsights } from '@vercel/speed-insights'
import { inject } from '@vercel/analytics'

export default defineNuxtPlugin(() => {
    if (import.meta.client) {
        injectSpeedInsights()
        inject()
    }
})