
<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
    return queryCollection('content').path(route.path).first()
})

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
