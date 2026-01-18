<script setup lang="ts">
    const { data: posts } = await useAsyncData('blog-posts', () => {
        return queryCollection('blog')
            .select('id', 'path', 'title', 'stem')
            .where('stem', '<>', 'blog/index')
            .all()
    })
</script>

<template>
    <div>
        <article v-for="post in posts" :key="post.id">
            <NuxtLink :to="post.path" class="underline hover:underline-offset-4">
                {{ post.title }}
            </NuxtLink>
        </article>
    </div>
</template>