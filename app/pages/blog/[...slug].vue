
<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
    return queryCollection('blog').path(route.path).first()
})

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
    <article class="bg-red-500 dark:bg-amber-300 dark:text-black p-5 rounded-lg prose dark:prose-invert prose-pre:bg-amber-300 dark:prose-pre:bg-amber-100">
        <ContentRenderer v-if="page" :value="page" />
    </article>
</template>
