import type { RouterOptions } from "@nuxt/schema";

export default <RouterOptions>{
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
                top: 50
            }
        }
        return { top: 0, behavior: 'smooth' }
    }
}