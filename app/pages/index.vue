
<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(
    route.path, 
    () => queryCollection('content').path(route.path).first(), {
        // Cache for 1 hour
        getCachedData: (key) => {
            // This will use Nuxt's built-in caching
            return useNuxtApp().payload.data[key]
        },
        // Server-side caching
        server: true,
        // Client-side caching
        default: () => null,
    }
    
)

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})

defineOgImageComponent('NuxtSeo', {
    title: title,
    description: description
})

</script>

<template>
    <article class="prose dark:prose-invert">
        <ContentRenderer v-if="page" :value="page" />
    </article>
</template>
