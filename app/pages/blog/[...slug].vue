
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
    <div class="mx-auto max-w-6xl">
        <div class="grid gap-8 lg:grid-cols-[1fr_280px]">
            <article class="bg-red-500 dark:bg-amber-300 dark:text-black p-5 rounded-lg prose dark:prose-invert prose-pre:bg-amber-300 dark:prose-pre:bg-amber-100 min-w-0 max-w-none">
                <ContentRenderer v-if="page" :value="page" />
            </article>
            <aside v-if="page?.body.toc?.links.length" class="lg:sticky lg:top-10 h-fit order-first lg:order-last">
                <nav class="rounded-lg border p-4">
                <p class="mb-3 text-sm font-semibold opacity-70">Table of Content</p>
                <ul>
                    <li v-for="section in page?.body.toc.links">
                        <NuxtLink :to="{hash: `#${section.id}`}">
                            {{ section.text }}
                        </NuxtLink>
                    </li>
                </ul>
                </nav>
            </aside>
        </div>
    </div>
</template>
