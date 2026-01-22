
<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(
    route.path, 
    () =>  queryCollection('content').path(route.path).first(),
    {
        getCachedData: (key) => {
            return useNuxtApp().payload.data[key]
        },
        server: true,
        default: () => null,
    }
)

useSeoMeta({
    title: page.value?.title,
    description: page.value?.description,
    ogTitle: page.value?.title,
    ogDescription: page.value?.description,
    twitterTitle: page.value?.title,
    twitterDescription: page.value?.description,
})

defineOgImageComponent('NuxtSeo', {
    title: page.value?.title,
    description: page.value?.description
})
</script>

<template>
    <article>
        <ContentRenderer v-if="page" :value="page" />
    </article>
</template>
