
<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
    return queryCollection('content').path(route.path).first()
})

useSeoMeta({
    title: page.value?.title,
    description: page.value?.description,
    ogTitle: page.value?.title,
    ogDescription: page.value?.description,
    twitterTitle: page.value?.title,
    twitterDescription: page.value?.description,
})
</script>

<template>
    <article class="bg-red-500 dark:bg-amber-300 dark:text-black p-5 rounded-lg prose dark:prose-invert">
        <ContentRenderer v-if="page" :value="page" />
    </article>
</template>
